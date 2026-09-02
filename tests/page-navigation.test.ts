import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { getAdjacentPages } from "@/lib/pageNavigation";

describe("getAdjacentPages", () => {
  it("returns only the next page at the start of the site", () => {
    expect(getAdjacentPages(profile.nav, "/")).toEqual({
      previous: null,
      next: { label: "关于我", href: "/learning" },
    });
  });

  it("returns only the previous page at the end of the two-page site", () => {
    expect(getAdjacentPages(profile.nav, "/learning/")).toEqual({
      previous: { label: "首页", href: "/" },
      next: null,
    });
  });

  it("does not treat the legacy contact URL as a navigable page", () => {
    expect(getAdjacentPages(profile.nav, "/roadmap")).toEqual({
      previous: null,
      next: null,
    });
  });
});
