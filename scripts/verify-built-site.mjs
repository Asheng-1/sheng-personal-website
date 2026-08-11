import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const requiredCommon = [
  '<html lang="zh-CN"',
  "Sheng",
  '<meta name="theme-color" content="#070811">',
  '<meta property="og:type" content="website">',
  '<meta property="og:title"',
  '<meta property="og:description"',
  '<meta name="twitter:card" content="summary_large_image">',
];

const requiredByPage = {
  home: [
    "AI TRAINER IN PROGRESS",
    "保持好奇",
    "奔赴未知",
    'href="/learning"',
    'href="/roadmap"',
    'id="top"',
    '<body class="screen-locked">',
    'alt="Sheng 的 3D IP 形象"',
  ],
  learning: ['id="learning"', "正在建立的能力"],
  roadmap: ['id="roadmap"'],
};

const forbiddenLiterals = [
  "Formspree",
  "Spotify",
  "example@email",
  "切换明暗主题",
  'rel="canonical"',
  'href="#learning"',
  'href="#roadmap"',
];

const expectedNavRoutes = ["/", "/learning", "/roadmap"];
const expectedLearningCardCount = 3;

function readAttribute(attributes, name) {
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "i"),
  );
  return match?.[2] ?? null;
}

function hasClass(attributes, className) {
  return (readAttribute(attributes, "class") ?? "")
    .split(/\s+/)
    .includes(className);
}

function isExplicitlyHidden(attributes) {
  const style = readAttribute(attributes, "style") ?? "";
  return (
    /(?:^|\s)hidden(?:\s|=|$)/i.test(attributes) ||
    readAttribute(attributes, "aria-hidden")?.toLowerCase() === "true" ||
    /(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\D|$))/i.test(
      style,
    )
  );
}

function findContainers(html, tagName) {
  const matches = html.matchAll(
    new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, "gi"),
  );
  return [...matches].map((match) => ({
    attributes: match[1] ?? "",
    innerHtml: match[2] ?? "",
  }));
}

function findElementByClass(html, className) {
  const openings = html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi);

  for (const opening of openings) {
    const tagName = opening[1];
    const attributes = opening[2] ?? "";
    if (!hasClass(attributes, className)) continue;

    const innerStart = (opening.index ?? 0) + opening[0].length;
    const closing = new RegExp(`<\\/${tagName}\\s*>`, "i");
    const closingMatch = closing.exec(html.slice(innerStart));
    if (!closingMatch) return null;

    return {
      attributes,
      innerHtml: html.slice(innerStart, innerStart + closingMatch.index),
    };
  }

  return null;
}

function hasResponsiveSrcset(attributes) {
  const srcset = readAttribute(attributes, "srcset");
  return Boolean(srcset && srcset.split(",").filter(Boolean).length >= 2);
}

function splitTopLevel(value) {
  const parts = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") depth -= 1;
    if (value[index] === "," && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function cssLengthInPixels(value, viewport) {
  const normalized = value.trim();
  const minMatch = normalized.match(/^min\((.+)\)$/i);
  if (minMatch) {
    return Math.min(
      ...splitTopLevel(minMatch[1]).map((part) =>
        cssLengthInPixels(part, viewport),
      ),
    );
  }

  const lengthMatch = normalized.match(/^(\d+(?:\.\d+)?)(px|vw|vh)$/i);
  if (!lengthMatch) return Number.NaN;
  const amount = Number.parseFloat(lengthMatch[1]);
  const unit = lengthMatch[2].toLowerCase();
  if (unit === "px") return amount;
  if (unit === "vw") return (amount / 100) * viewport.width;
  return (amount / 100) * viewport.height;
}

function mediaMatches(media, viewport) {
  const maxWidth = media.match(/max-width\s*:\s*(\d+(?:\.\d+)?)px/i);
  if (maxWidth && viewport.width > Number.parseFloat(maxWidth[1])) return false;
  const minWidth = media.match(/min-width\s*:\s*(\d+(?:\.\d+)?)px/i);
  if (minWidth && viewport.width < Number.parseFloat(minWidth[1])) return false;
  return true;
}

function advertisedSourceWidth(sizes, viewport) {
  for (const entry of splitTopLevel(sizes)) {
    const withMedia = entry.match(/^(\([^)]*\))\s+(.+)$/);
    if (withMedia && !mediaMatches(withMedia[1], viewport)) continue;
    const width = cssLengthInPixels(withMedia?.[2] ?? entry, viewport);
    if (Number.isFinite(width)) return width;
  }
  return viewport.width;
}

function selectedResponsiveWidth(attributes, viewport) {
  const widths = (readAttribute(attributes, "srcset") ?? "")
    .split(",")
    .map((candidate) => Number.parseInt(candidate.match(/(\d+)w\s*$/)?.[1] ?? "", 10))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  const advertised = advertisedSourceWidth(
    readAttribute(attributes, "sizes") ?? "100vw",
    viewport,
  );

  return widths.find((width) => width >= advertised) ?? widths.at(-1) ?? 0;
}

export function renderedTextFromHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(
      /<\/?(?:address|article|aside|blockquote|br|div|footer|h[1-6]|header|li|main|nav|ol|p|section|table|td|th|tr|ul)\b[^>]*>/gi,
      " ",
    )
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_match, value) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    )
    .replace(/&#(\d+);/g, (_match, value) =>
      String.fromCodePoint(Number.parseInt(value, 10)),
    )
    .replace(/&(amp|lt|gt|quot|apos);/gi, (match, entity) => {
      const decoded = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
      return decoded[entity.toLowerCase()] ?? match;
    })
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function inspectBuiltPage(html, page) {
  const renderedText = renderedTextFromHtml(html);
  const primaryNav = findContainers(html, "nav").find(
    ({ attributes }) =>
      readAttribute(attributes, "aria-label") === "Primary navigation" &&
      !isExplicitlyHidden(attributes),
  );
  const navRoutes = primaryNav
    ? [...primaryNav.innerHtml.matchAll(/<a\b([^>]*)>/gi)].map((match) =>
        readAttribute(match[1] ?? "", "href"),
      )
    : [];
  const footer = findContainers(html, "footer")[0];

  const result = {
    page,
    missing: [...requiredCommon, ...requiredByPage[page]].filter(
      (value) => !html.includes(value),
    ),
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    foundForbidden: forbiddenLiterals.filter((value) =>
      html.toLowerCase().includes(value.toLowerCase()),
    ),
    hasFakePercentage: /\b\d{1,3}(?:\.\d+)?\s*%/.test(renderedText),
    hasExampleEmail:
      /\b(?:example|hello|name|yourname)@[\w.-]+\.[a-z]{2,}\b/i.test(
        renderedText,
      ),
    navRoutesValid:
      navRoutes.length === expectedNavRoutes.length &&
      navRoutes.every((href, index) => href === expectedNavRoutes[index]),
    activeNavCount: primaryNav
      ? (primaryNav.innerHtml.match(/aria-current="page"/gi) ?? []).length
      : 0,
    footerValid: !footer,
    singleScreenValid:
      (html.match(/<section\b/gi) ?? []).length === 1 &&
      html.includes('<body class="screen-locked">') &&
      !footer,
    canvasCount: (html.match(/<canvas\b/gi) ?? []).length,
    heroIdentityVisible: true,
    learningStatusesValid: true,
    responsivePortraitValid: true,
    portraitDensityValid: true,
  };

  if (page === "home") {
    const hero = findContainers(html, "section").find(
      ({ attributes }) => readAttribute(attributes, "id") === "top",
    );
    const eyebrow = hero
      ? findElementByClass(hero.innerHtml, "hero__hello")
      : null;
    const role = hero ? findElementByClass(hero.innerHtml, "hero__role") : null;
    result.heroIdentityVisible = Boolean(
      hero &&
      !isExplicitlyHidden(hero.attributes) &&
      eyebrow &&
      !isExplicitlyHidden(eyebrow.attributes) &&
      renderedTextFromHtml(eyebrow.innerHtml) === "HELLO, I'M SHENG" &&
      role &&
      !isExplicitlyHidden(role.attributes) &&
      renderedTextFromHtml(role.innerHtml) === "AI TRAINER IN PROGRESS",
    );

    const portrait = findContainers(hero?.innerHtml ?? "", "picture").find(
      ({ innerHtml }) =>
        [...innerHtml.matchAll(/<img\b([^>]*)>/gi)].some(
          (match) =>
            readAttribute(match[1] ?? "", "alt") === "Sheng 的 3D IP 形象",
        ),
    );
    const portraitSources = portrait
      ? [...portrait.innerHtml.matchAll(/<source\b([^>]*)>/gi)].map(
          (match) => match[1] ?? "",
        )
      : [];
    const portraitImageAttributes = portrait
      ? [...portrait.innerHtml.matchAll(/<img\b([^>]*)>/gi)]
          .map((match) => match[1] ?? "")
          .find(
            (attributes) =>
              readAttribute(attributes, "alt") === "Sheng 的 3D IP 形象",
          )
      : null;
    result.responsivePortraitValid = Boolean(
      portrait &&
      portraitSources.some(
        (attributes) =>
          readAttribute(attributes, "type") === "image/avif" &&
          hasResponsiveSrcset(attributes),
      ) &&
      portraitSources.some(
        (attributes) =>
          readAttribute(attributes, "type") === "image/webp" &&
          hasResponsiveSrcset(attributes),
      ) &&
      portraitImageAttributes &&
      /\.png(?:\?|$)/i.test(
        readAttribute(portraitImageAttributes, "src") ?? "",
      ) &&
      Boolean(readAttribute(portraitImageAttributes, "width")) &&
      Boolean(readAttribute(portraitImageAttributes, "height")) &&
      Boolean(readAttribute(portraitImageAttributes, "sizes")),
    );
    const avifSource = portraitSources.find(
      (attributes) => readAttribute(attributes, "type") === "image/avif",
    );
    result.portraitDensityValid = Boolean(
      avifSource &&
      selectedResponsiveWidth(avifSource, { width: 1154, height: 912 }) >=
        1672,
    );
  }

  if (page === "learning") {
    const learning = findContainers(html, "section").find(
      ({ attributes }) => readAttribute(attributes, "id") === "learning",
    );
    const learningList = learning
      ? findContainers(learning.innerHtml, "ul").find(({ attributes }) =>
          hasClass(attributes, "learning__grid"),
        )
      : null;
    const cards = learningList
      ? findContainers(learningList.innerHtml, "li")
      : [];
    result.learningStatusesValid =
      cards.length === expectedLearningCardCount &&
      cards.every(({ innerHtml }) => {
        const status = findElementByClass(innerHtml, "learning__status");
        return Boolean(
          status &&
          !isExplicitlyHidden(status.attributes) &&
          renderedTextFromHtml(status.innerHtml) === "正在学习",
        );
      });
  }

  return result;
}

export function inspectBuiltSite(pages) {
  return {
    home: inspectBuiltPage(pages.home, "home"),
    learning: inspectBuiltPage(pages.learning, "learning"),
    roadmap: inspectBuiltPage(pages.roadmap, "roadmap"),
  };
}

function pageHasContractFailure(result) {
  const expectedCanvasCount = result.page === "home" ? 1 : 0;
  return (
    result.missing.length > 0 ||
    result.h1Count !== 1 ||
    result.foundForbidden.length > 0 ||
    result.hasFakePercentage ||
    result.hasExampleEmail ||
    !result.navRoutesValid ||
    result.activeNavCount !== 1 ||
    !result.footerValid ||
    !result.singleScreenValid ||
    !result.heroIdentityVisible ||
    !result.learningStatusesValid ||
    !result.responsivePortraitValid ||
    !result.portraitDensityValid ||
    result.canvasCount !== expectedCanvasCount
  );
}

export function hasContractFailure(result) {
  return Object.values(result).some(pageHasContractFailure);
}

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const pages = {
    home: readFileSync(new URL("../dist/index.html", import.meta.url), "utf8"),
    learning: readFileSync(
      new URL("../dist/learning/index.html", import.meta.url),
      "utf8",
    ),
    roadmap: readFileSync(
      new URL("../dist/roadmap/index.html", import.meta.url),
      "utf8",
    ),
  };
  const result = inspectBuiltSite(pages);

  if (hasContractFailure(result)) {
    console.error(result);
    process.exit(1);
  }

  console.log("Built-site contract verified for /, /learning, and /roadmap.");
}
