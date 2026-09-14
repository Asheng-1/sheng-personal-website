import { describe, expect, it, vi } from "vitest";
import { handleRequest, type WorkerEnv } from "../worker/src/index";

const allowedOrigin = "https://shengos.com";

const makeEnv = (rateLimitSuccess = true): WorkerEnv => ({
  DIFY_API_KEY: "test-only-secret",
  ASSISTANT_RATE_LIMITER: {
    limit: vi.fn().mockResolvedValue({ success: rateLimitSuccess }),
  },
});

const makeRequest = (body: Record<string, unknown>, origin = allowedOrigin) =>
  new Request("https://worker.example/chat", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify(body),
  });

describe("assistant Worker security boundary", () => {
  it("rejects requests from unapproved browser origins", async () => {
    const upstream = vi.fn();
    const response = await handleRequest(
      makeRequest({ query: "你好" }, "https://example.com"),
      makeEnv(),
      upstream,
    );

    expect(response.status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("rejects oversized prompts before contacting Dify", async () => {
    const upstream = vi.fn();
    const response = await handleRequest(
      makeRequest({ query: "问".repeat(1001), user: "visitor-12345678" }),
      makeEnv(),
      upstream,
    );

    expect(response.status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("stops rate-limited requests before contacting Dify", async () => {
    const upstream = vi.fn();
    const response = await handleRequest(
      makeRequest({ query: "你好", user: "visitor-12345678" }),
      makeEnv(false),
      upstream,
    );

    expect(response.status).toBe(429);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("forwards an allowed request with the server-only key and streams the response", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValue(
        new Response(
          'data: {"event":"message","answer":"你好","conversation_id":"conversation-1","internal":"do-not-forward"}\n\n',
          { headers: { "content-type": "text/event-stream" } },
        ),
      );
    const env = makeEnv();
    const response = await handleRequest(
      makeRequest({
        query: "Sheng 做过哪些项目？",
        user: "visitor-12345678",
        conversationId: "conversation-1",
      }),
      env,
      upstream,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      allowedOrigin,
    );
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(upstream).toHaveBeenCalledOnce();

    const [url, init] = upstream.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.dify.ai/v1/chat-messages");
    expect(new Headers(init.headers).get("authorization")).toBe(
      "Bearer test-only-secret",
    );
    expect(JSON.parse(String(init.body))).toMatchObject({
      inputs: {},
      query: "Sheng 做过哪些项目？",
      response_mode: "streaming",
      user: "visitor-12345678",
      conversation_id: "conversation-1",
    });

    const streamedBody = await response.text();
    expect(streamedBody).toContain('"answer":"你好"');
    expect(streamedBody).toContain('"conversation_id":"conversation-1"');
    expect(streamedBody).not.toContain("do-not-forward");
  });

  it("replaces upstream stream errors with a generic public message", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValue(
        new Response(
          'data: {"event":"error","message":"private upstream detail"}\n\n',
          { headers: { "content-type": "text/event-stream" } },
        ),
      );
    const response = await handleRequest(
      makeRequest({ query: "你好", user: "visitor-12345678" }),
      makeEnv(),
      upstream,
    );

    const streamedBody = await response.text();
    expect(streamedBody).toContain("回答生成失败，请稍后重试。");
    expect(streamedBody).not.toContain("private upstream detail");
  });

  it("removes model reasoning blocks before sending the answer to the browser", async () => {
    const upstream = vi
      .fn()
      .mockResolvedValue(
        new Response(
          [
            'data: {"event":"message","answer":"<think>private ","conversation_id":"conversation-1"}',
            "",
            'data: {"event":"message","answer":"reasoning</think>Final answer","conversation_id":"conversation-1"}',
            "",
            'data: {"event":"message_end","conversation_id":"conversation-1"}',
            "",
          ].join("\n"),
          { headers: { "content-type": "text/event-stream" } },
        ),
      );

    const response = await handleRequest(
      makeRequest({
        query: "How can I contact Sheng?",
        user: "visitor-12345678",
      }),
      makeEnv(),
      upstream,
    );
    const streamedBody = await response.text();

    expect(streamedBody).toContain("Final answer");
    expect(streamedBody).not.toContain("<think>");
    expect(streamedBody).not.toContain("private reasoning");
  });
});
