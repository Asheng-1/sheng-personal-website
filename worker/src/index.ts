const DIFY_CHAT_URL = "https://api.dify.ai/v1/chat-messages";
const MAX_QUERY_LENGTH = 1000;
const MAX_BODY_BYTES = 16_384;
const UPSTREAM_TIMEOUT_MS = 45_000;
const ALLOWED_ORIGINS = new Set([
  "https://shengos.com",
  "https://www.shengos.com",
  "http://127.0.0.1:4321",
  "http://localhost:4321",
]);

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface WorkerEnv {
  DIFY_API_KEY: string;
  ASSISTANT_RATE_LIMITER: RateLimiter;
}

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

const corsHeaders = (origin: string) => ({
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
  vary: "Origin",
});

const jsonResponse = (status: number, error: string, origin?: string) =>
  Response.json(
    { error },
    {
      status,
      headers: {
        ...(origin ? corsHeaders(origin) : {}),
        "cache-control": "no-store",
      },
    },
  );

const isValidIdentifier = (value: unknown, minimum = 1) =>
  typeof value === "string" &&
  value.length >= minimum &&
  value.length <= 100 &&
  /^[A-Za-z0-9_-]+$/.test(value);

const parseDifyFrame = (frame: string) => {
  const payload = frame
    .replaceAll("\r", "")
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
    .trim();

  if (!payload || payload === "[DONE]") return null;

  try {
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const stripModelReasoning = (answer: string) =>
  answer
    .replace(/<!--\s*dify-deepseek-reasoning\s*-->/gi, "")
    .replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/gi, "")
    .replace(/<think\b[^>]*>[\s\S]*$/gi, "")
    .trimStart();

const sanitizeDifyFrame = (frame: string) => {
  const data = parseDifyFrame(frame);
  if (!data) return null;

  try {
    const event = typeof data.event === "string" ? data.event : "";
    const conversationId =
      typeof data.conversation_id === "string"
        ? data.conversation_id
        : undefined;

    if (
      event === "message" ||
      event === "agent_message" ||
      event === "message_replace"
    ) {
      return `data: ${JSON.stringify({
        event,
        answer: typeof data.answer === "string" ? data.answer : "",
        ...(conversationId ? { conversation_id: conversationId } : {}),
      })}\n\n`;
    }

    if (event === "message_end" || event === "workflow_finished") {
      return `data: ${JSON.stringify({
        event,
        ...(conversationId ? { conversation_id: conversationId } : {}),
      })}\n\n`;
    }

    if (event === "error") {
      return `data: ${JSON.stringify({
        event: "error",
        message: "回答生成失败，请稍后重试。",
      })}\n\n`;
    }

    if (event === "ping") return ": ping\n\n";
  } catch {
    return null;
  }

  return null;
};

const sanitizeDifyStream = (stream: ReadableStream<Uint8Array>) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let answer = "";
  let conversationId: string | undefined;
  let answerSent = false;

  const enqueueAnswer = (
    controller: TransformStreamDefaultController<Uint8Array>,
  ) => {
    if (answerSent) return;
    answerSent = true;
    const safeAnswer = stripModelReasoning(answer);
    if (!safeAnswer) return;
    controller.enqueue(
      encoder.encode(
        `data: ${JSON.stringify({
          event: "message_replace",
          answer: safeAnswer,
          ...(conversationId ? { conversation_id: conversationId } : {}),
        })}\n\n`,
      ),
    );
  };

  const enqueueFrames = (
    frames: string[],
    controller: TransformStreamDefaultController<Uint8Array>,
  ) => {
    frames.forEach((frame) => {
      const data = parseDifyFrame(frame);
      const event = typeof data?.event === "string" ? data.event : "";
      if (typeof data?.conversation_id === "string") {
        conversationId = data.conversation_id;
      }
      if (event === "message" || event === "agent_message") {
        if (typeof data?.answer === "string") answer += data.answer;
        return;
      }
      if (event === "message_replace") {
        answer = typeof data?.answer === "string" ? data.answer : "";
        return;
      }
      if (event === "message_end" || event === "workflow_finished") {
        enqueueAnswer(controller);
      }
      const sanitized = sanitizeDifyFrame(frame);
      if (sanitized) controller.enqueue(encoder.encode(sanitized));
    });
  };

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() ?? "";
        enqueueFrames(frames, controller);
      },
      flush(controller) {
        buffer += decoder.decode();
        if (buffer.trim()) enqueueFrames([buffer], controller);
        enqueueAnswer(controller);
      },
    }),
  );
};

export async function handleRequest(
  request: Request,
  env: WorkerEnv,
  upstreamFetch: Fetcher = fetch,
): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return Response.json(
      { status: "ok" },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const origin = request.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse(403, "当前来源不允许访问 AI 助手。");
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST" || url.pathname !== "/chat") {
    return jsonResponse(404, "请求地址不存在。", origin);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(415, "请求格式必须为 JSON。", origin);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse(413, "请求内容过大。", origin);
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse(413, "请求内容过大。", origin);
    }
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return jsonResponse(400, "请求内容无法解析。", origin);
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const user = body.user;
  const conversationId = body.conversationId;

  if (!query || query.length > MAX_QUERY_LENGTH) {
    return jsonResponse(
      400,
      `问题长度应为 1-${MAX_QUERY_LENGTH} 个字符。`,
      origin,
    );
  }
  if (!isValidIdentifier(user, 8)) {
    return jsonResponse(400, "访客标识无效。", origin);
  }
  if (
    conversationId !== undefined &&
    conversationId !== "" &&
    !isValidIdentifier(conversationId)
  ) {
    return jsonResponse(400, "会话标识无效。", origin);
  }

  const rateLimitKey = request.headers.get("cf-connecting-ip") || String(user);
  try {
    const { success } = await env.ASSISTANT_RATE_LIMITER.limit({
      key: `chat:${rateLimitKey}`,
    });
    if (!success) {
      return jsonResponse(429, "提问有些频繁，请稍后再试。", origin);
    }
  } catch {
    return jsonResponse(503, "AI 助手正在维护，请稍后再试。", origin);
  }

  if (!env.DIFY_API_KEY) {
    return jsonResponse(503, "AI 助手尚未完成配置。", origin);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await upstreamFetch(DIFY_CHAT_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.DIFY_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: "streaming",
        user,
        ...(conversationId ? { conversation_id: String(conversationId) } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const status = response.status === 429 ? 429 : 502;
      return jsonResponse(
        status,
        status === 429
          ? "AI 助手当前请求较多，请稍后再试。"
          : "AI 助手暂时没有响应，请稍后再试。",
        origin,
      );
    }

    return new Response(sanitizeDifyStream(response.body), {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        "cache-control": "no-cache, no-store",
        "content-type": "text/event-stream; charset=utf-8",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    return jsonResponse(
      controller.signal.aborted ? 504 : 502,
      controller.signal.aborted
        ? "AI 助手响应超时，请重新提问。"
        : "AI 助手暂时无法连接，请稍后再试。",
      origin,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  fetch(request: Request, env: WorkerEnv) {
    return handleRequest(request, env);
  },
};
