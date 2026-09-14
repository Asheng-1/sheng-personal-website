import { describe, expect, it } from "vitest";
import { parseDifySseFrame } from "@/lib/difyStream";

describe("Dify SSE parser", () => {
  it("extracts streamed answer chunks without rendering upstream markup", () => {
    expect(
      parseDifySseFrame(
        'data: {"event":"message","answer":"你好","conversation_id":"conversation-1"}',
      ),
    ).toEqual({
      type: "append",
      text: "你好",
      conversationId: "conversation-1",
    });
  });

  it("supports replacement and completion events", () => {
    expect(
      parseDifySseFrame(
        'data: {"event":"message_replace","answer":"完整回答","conversation_id":"conversation-1"}',
      ),
    ).toEqual({
      type: "replace",
      text: "完整回答",
      conversationId: "conversation-1",
    });
    expect(
      parseDifySseFrame(
        'data: {"event":"message_end","conversation_id":"conversation-1"}',
      ),
    ).toEqual({
      type: "done",
      conversationId: "conversation-1",
    });
  });

  it("ignores keep-alives and malformed frames", () => {
    expect(parseDifySseFrame(": ping")).toBeNull();
    expect(parseDifySseFrame("data: not-json")).toBeNull();
  });
});
