import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { getAdjacentPages } from "@/lib/pageNavigation";
import { stripBasePath, withBasePath } from "@/lib/sitePath";

describe("GitHub Pages base paths", () => {
  it("prefixes site routes without changing root development routes", () => {
    expect(withBasePath("/", "/")).toBe("/");
    expect(withBasePath("/learning", "/")).toBe("/learning");
    expect(withBasePath("/", "/sheng-personal-website/")).toBe(
      "/sheng-personal-website/",
    );
    expect(withBasePath("/learning#contact", "/sheng-personal-website/")).toBe(
      "/sheng-personal-website/learning#contact",
    );
  });

  it("removes the deployment base before matching the active page", () => {
    expect(stripBasePath("/", "/")).toBe("/");
    expect(
      stripBasePath(
        "/sheng-personal-website/learning/",
        "/sheng-personal-website/",
      ),
    ).toBe("/learning/");
  });
});

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
