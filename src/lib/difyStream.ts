export type DifyStreamUpdate =
  | {
      type: "append" | "replace";
      text: string;
      conversationId?: string;
    }
  | { type: "done"; conversationId?: string }
  | { type: "error"; message: string; conversationId?: string };

const asText = (value: unknown) =>
  typeof value === "string" ? value : undefined;

export function parseDifySseFrame(frame: string): DifyStreamUpdate | null {
  const payload = frame
    .replaceAll("\r", "")
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
    .trim();

  if (!payload || payload === "[DONE]") return null;

  try {
    const data = JSON.parse(payload) as Record<string, unknown>;
    const event = asText(data.event);
    const conversationId = asText(data.conversation_id);

    if (event === "message" || event === "agent_message") {
      return {
        type: "append",
        text: asText(data.answer) ?? "",
        conversationId,
      };
    }

    if (event === "message_replace") {
      return {
        type: "replace",
        text: asText(data.answer) ?? "",
        conversationId,
      };
    }

    if (event === "message_end" || event === "workflow_finished") {
      return { type: "done", conversationId };
    }

    if (event === "error") {
      return {
        type: "error",
        message: asText(data.message) ?? "回答生成失败，请稍后重试。",
        conversationId,
      };
    }
  } catch {
    return null;
  }

  return null;
}

interface StreamCallbacks {
  onAppend: (text: string) => void;
  onReplace: (text: string) => void;
  onConversation: (conversationId: string) => void;
}

export async function consumeDifyStream(
  response: Response,
  callbacks: StreamCallbacks,
) {
  if (!response.ok) {
    const fallback = "暂时无法连接 AI 助手，请稍后再试。";
    let message = fallback;
    try {
      const data = (await response.json()) as { error?: unknown };
      if (typeof data.error === "string") message = data.error;
    } catch {}
    throw new Error(message);
  }

  if (!response.body) throw new Error("AI 助手没有返回内容，请稍后再试。");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    const update = parseDifySseFrame(frame);
    if (!update) return;
    if (update.conversationId) callbacks.onConversation(update.conversationId);
    if (update.type === "append") callbacks.onAppend(update.text);
    if (update.type === "replace") callbacks.onReplace(update.text);
    if (update.type === "error") throw new Error(update.message);
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() ?? "";
    frames.forEach(processFrame);
    if (done) break;
  }

  if (buffer.trim()) processFrame(buffer);
}
