import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fromRoot = (path: string) =>
  fileURLToPath(new URL(`../${path}`, import.meta.url));
const readSource = (path: string) => readFileSync(fromRoot(path), "utf8");

describe("personal-site assistant shell", () => {
  it("mounts one accessible custom assistant in the shared site layout", () => {
    const layout = readSource("src/layouts/SiteLayout.astro");
    const assistant = readSource("src/components/assistant/AssistantChat.tsx");

    expect(layout).toContain(
      'import { AssistantChat } from "@/components/assistant/AssistantChat"',
    );
    expect(layout.match(/<AssistantChat\b/g)).toHaveLength(1);
    expect(layout).toContain("client:idle");
    expect(assistant).toContain('aria-label="打开 AI 助手"');
    expect(assistant).toContain('role="dialog"');
    expect(assistant).toContain('aria-live="polite"');
    expect(assistant).toContain("根据公开经历回答");
    expect(assistant).toContain("Sheng 的 AI 小助手");
    expect(assistant).toContain("终于等到你来啦～");
    expect(assistant).toContain("欢迎来到 Sheng 的网站");
    expect(assistant).toContain("assistant-chat__nudge");
  });

  it("calls only the public Worker endpoint and never embeds a Dify credential", () => {
    const layout = readSource("src/layouts/SiteLayout.astro");
    const assistant = readSource("src/components/assistant/AssistantChat.tsx");
    const workerConfig = readSource("worker/wrangler.jsonc");
    const combined = `${layout}\n${assistant}\n${workerConfig}`;

    expect(layout).toContain(
      "https://sheng-assistant-api.lock-06789.workers.dev/chat",
    );
    expect(combined).not.toContain("udify.app/embed.min.js");
    expect(combined).not.toMatch(/app-[A-Za-z0-9_-]{10,}/);
    expect(workerConfig).toContain('"required": ["DIFY_API_KEY"]');
    expect(workerConfig).not.toContain("Bearer ");
  });
});
