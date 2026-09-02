import { afterEach, describe, expect, it, vi } from "vitest";
import { scheduleRevealFallback } from "@/components/effects/ScrollReveal";

describe("ScrollReveal", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reveals content and disconnects the observer after the fallback delay", () => {
    vi.useFakeTimers();
    const node = { dataset: { visible: "false" } } as unknown as HTMLElement;
    const observer = { disconnect: vi.fn() };

    scheduleRevealFallback(node, observer, 900);
    vi.advanceTimersByTime(899);
    expect(node.dataset.visible).toBe("false");

    vi.advanceTimersByTime(1);
    expect(node.dataset.visible).toBe("true");
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });
});
