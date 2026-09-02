import { readFileSync, readdirSync } from "node:fs";
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
    "探索未知",
    'href="/learning"',
    'href="/learning#contact"',
    'id="top"',
    '<body class="screen-locked">',
    'alt="Sheng 的 3D IP 形象"',
  ],
  learning: [],
  roadmap: [],
};

const forbiddenLiterals = [
  "Formspree",
  "Spotify",
  "example@email",
  "切换明暗主题",
  'rel="canonical"',
  'href="#learning"',
  'href="#roadmap"',
  'href="/roadmap"',
];

const expectedNavRoutes = ["/", "/learning"];

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
    .map((candidate) =>
      Number.parseInt(candidate.match(/(\d+)w\s*$/)?.[1] ?? "", 10),
    )
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

export function inspectBuiltPage(html, page, styles = html) {
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
  const footer = findContainers(html, "footer").find(({ attributes }) =>
    hasClass(attributes, "site-footer"),
  );

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
    heroSignatureValid: true,
    futureOsInterfaceValid: true,
    identityAvatarValid: true,
    learningStatusesValid: true,
    aboutSectionsValid: true,
    responsivePortraitValid: true,
    portraitDensityValid: true,
    learningRailAccessible: true,
    aboutRailAccessible: true,
    identityContactValid: true,
    identityLabelsLocalized: true,
    publishedEmailValid: true,
    aboutScrollValid: true,
    standaloneContactAbsent: true,
    viewportFallbackValid:
      /(?:max-height\s*:\s*43\.75rem|height\s*<=\s*43\.75rem)/i.test(styles) &&
      /overflow-y\s*:\s*auto/i.test(styles),
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

    const heroHeading = hero ? findContainers(hero.innerHtml, "h1")[0] : null;
    result.heroSignatureValid = Boolean(
      heroHeading &&
      renderedTextFromHtml(heroHeading.innerHtml).replace(/\s+/g, "") ===
        "保持好奇，探索未知。",
    );

    const identityPanel = hero
      ? findElementByClass(hero.innerHtml, "hero__identity-panel")
      : null;
    const statusPanel = hero
      ? findElementByClass(hero.innerHtml, "hero__status-panel")
      : null;
    const scanRing = hero
      ? findElementByClass(hero.innerHtml, "hero__scan-ring")
      : null;
    const introduction = hero
      ? findElementByClass(hero.innerHtml, "hero__intro")
      : null;
    result.futureOsInterfaceValid = Boolean(
      hero &&
      readAttribute(hero.attributes, "data-interface") === "personal-os" &&
      identityPanel &&
      readAttribute(identityPanel.attributes, "aria-label") === "数字身份" &&
      statusPanel &&
      readAttribute(statusPanel.attributes, "aria-label") === "个人状态" &&
      (hero.innerHtml.match(/<dt\b/gi) ?? []).length >= 3 &&
      scanRing &&
      readAttribute(scanRing.attributes, "aria-hidden") === "true" &&
      introduction &&
      renderedTextFromHtml(introduction.innerHtml) ===
        "正在把好奇，训练成判断力。",
    );

    const identityAvatar = identityPanel
      ? findContainers(identityPanel.innerHtml, "picture")[0]
      : null;
    const identityAvatarSources = identityAvatar
      ? [...identityAvatar.innerHtml.matchAll(/<source\b([^>]*)>/gi)].map(
          (match) => match[1] ?? "",
        )
      : [];
    const identityAvatarImage = identityAvatar
      ? [...identityAvatar.innerHtml.matchAll(/<img\b([^>]*)>/gi)].map(
          (match) => match[1] ?? "",
        )[0]
      : null;
    result.identityAvatarValid = Boolean(
      identityAvatar &&
      identityAvatarSources.some(
        (attributes) =>
          readAttribute(attributes, "type") === "image/avif" &&
          hasResponsiveSrcset(attributes),
      ) &&
      identityAvatarSources.some(
        (attributes) =>
          readAttribute(attributes, "type") === "image/webp" &&
          hasResponsiveSrcset(attributes),
      ) &&
      identityAvatarImage &&
      readAttribute(identityAvatarImage, "alt") === "Sheng 常用头像" &&
      Boolean(readAttribute(identityAvatarImage, "width")) &&
      Boolean(readAttribute(identityAvatarImage, "height")),
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
      selectedResponsiveWidth(avifSource, { width: 1154, height: 912 }) >= 1672,
    );
  }

  if (page === "learning") {
    const about = findContainers(html, "section").find(
      ({ attributes }) => readAttribute(attributes, "id") === "about",
    );
    const consolePanel = findElementByClass(html, "about__console");
    const identity = findElementByClass(html, "about__identity");
    const biography = findElementByClass(html, "about__biography");
    const focusAreas = findElementByClass(html, "about__focus-areas");
    const identityContact = findElementByClass(html, "about__contact-fact");
    const portfolio = findElementByClass(html, "about__portfolio");
    const workGrid = findElementByClass(html, "about__work-grid");
    const standaloneContact = findContainers(html, "section").find(
      ({ attributes }) => readAttribute(attributes, "id") === "contact",
    );
    const aboutText = renderedTextFromHtml(html);
    const identityText = identity
      ? renderedTextFromHtml(identity.innerHtml)
      : "";
    const identityContactHref = identity
      ? [...identity.innerHtml.matchAll(/<a\b([^>]*)>/gi)]
          .map((match) => readAttribute(match[1] ?? "", "href"))
          .find(Boolean)
      : null;

    result.aboutSectionsValid = Boolean(
      about &&
      consolePanel &&
      identity &&
      biography &&
      focusAreas &&
      identityContact &&
      portfolio &&
      workGrid &&
      identityText.includes("来自广东广州") &&
      aboutText.includes(
        "你好，我是 Sheng，来自广东广州。正在从事 AI 行业工作，沿着通往 AGI 之路持续学习和积累。",
      ) &&
      aboutText.includes(
        "对我来说，这不只是一个新的职业选择，也是一次重新认识技术、内容和人的过程。我会从具体的学习与练习开始，逐步建立自己的理解和判断。",
      ) &&
      aboutText.includes(
        "这个网站会记录我的学习、作品和思考，也会随着我的经历继续更新。",
      ) &&
      aboutText.includes("具身智能") &&
      aboutText.includes("AI Agent") &&
      aboutText.includes("多模态交互") &&
      aboutText.includes("作品正在整理中，之后会从这里开始更新。"),
    );
    result.aboutRailAccessible = Boolean(
      identity &&
      readAttribute(identity.attributes, "aria-label") === "个人信息" &&
      biography &&
      readAttribute(biography.attributes, "aria-label") === "个人介绍" &&
      focusAreas &&
      readAttribute(focusAreas.attributes, "aria-labelledby") ===
        "focus-areas-title" &&
      portfolio &&
      readAttribute(portfolio.attributes, "aria-labelledby") ===
        "portfolio-title",
    );
    result.identityContactValid = Boolean(
      identityContact &&
      readAttribute(identityContact.attributes, "id") === "contact" &&
      identityContactHref &&
      identityContactHref.startsWith("mailto:"),
    );
    const identityContactText = identityContact
      ? renderedTextFromHtml(identityContact.innerHtml)
      : "";
    result.identityLabelsLocalized =
      identityText.includes("所在地") &&
      identityContactText.includes("联系方式") &&
      !identityText.includes("LOCATION") &&
      !identityText.includes("CONTACT");
    const publishedEmailLinks =
      html.match(/href="mailto:asheng060@163\.com"/g) ?? [];
    result.publishedEmailValid =
      publishedEmailLinks.length === 1 &&
      aboutText.includes("asheng060@163.com");
    result.aboutScrollValid =
      !html.includes('<body class="screen-locked">') && !footer;
    result.standaloneContactAbsent = !standaloneContact;
  }

  return result;
}

export function inspectBuiltSite(pages, styles) {
  return {
    home: inspectBuiltPage(pages.home, "home", styles),
    learning: inspectBuiltPage(pages.learning, "learning", styles),
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
    (result.page === "home" && !result.singleScreenValid) ||
    !result.heroIdentityVisible ||
    !result.heroSignatureValid ||
    !result.futureOsInterfaceValid ||
    !result.identityAvatarValid ||
    !result.aboutSectionsValid ||
    !result.responsivePortraitValid ||
    !result.portraitDensityValid ||
    !result.aboutRailAccessible ||
    !result.identityContactValid ||
    !result.identityLabelsLocalized ||
    !result.publishedEmailValid ||
    !result.aboutScrollValid ||
    !result.standaloneContactAbsent ||
    !result.viewportFallbackValid ||
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
  const assetDirectory = new URL("../dist/_astro/", import.meta.url);
  const styles = readdirSync(assetDirectory)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(new URL(name, assetDirectory), "utf8"))
    .join("\n");
  const pages = {
    home: readFileSync(new URL("../dist/index.html", import.meta.url), "utf8"),
    learning: readFileSync(
      new URL("../dist/learning/index.html", import.meta.url),
      "utf8",
    ),
  };
  const result = inspectBuiltSite(pages, styles);

  if (hasContractFailure(result)) {
    console.error(result);
    process.exit(1);
  }

  console.log("Built-site contract verified for / and /learning.");
}
