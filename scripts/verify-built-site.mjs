import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const required = [
  '<html lang="zh-CN"',
  'Sheng',
  'AI TRAINER IN PROGRESS',
  '保持好奇',
  '奔赴未知',
  'href="#top"',
  'href="#learning"',
  'href="#roadmap"',
  'id="about"',
  'id="learning"',
  'id="roadmap"',
  'id="principles"',
  'alt="Sheng 的 3D IP 形象"',
  '<meta name="theme-color" content="#070811">',
  '<meta property="og:type" content="website">',
  '<meta property="og:title"',
  '<meta property="og:description"',
  '<meta name="twitter:card" content="summary_large_image">',
];

const forbiddenLiterals = [
  'Formspree',
  'Spotify',
  'example@email',
  '切换明暗主题',
  'rel="canonical"',
];

const expectedNavAnchors = ['#top', '#learning', '#roadmap'];
const expectedFooter =
  'SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY';
const expectedLearningCardCount = 3;

function readAttribute(attributes, name) {
  const match = attributes.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'),
  );
  return match?.[2] ?? null;
}

function hasClass(attributes, className) {
  return (readAttribute(attributes, 'class') ?? '')
    .split(/\s+/)
    .includes(className);
}

function isExplicitlyHidden(attributes) {
  const style = readAttribute(attributes, 'style') ?? '';
  return (
    /(?:^|\s)hidden(?:\s|=|$)/i.test(attributes) ||
    readAttribute(attributes, 'aria-hidden')?.toLowerCase() === 'true' ||
    /(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\D|$))/i.test(
      style,
    )
  );
}

function findContainers(html, tagName) {
  const matches = html.matchAll(
    new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'gi'),
  );
  return [...matches].map((match) => ({
    attributes: match[1] ?? '',
    innerHtml: match[2] ?? '',
    html: match[0],
  }));
}

function findElementByClass(html, className) {
  const openings = html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi);

  for (const opening of openings) {
    const tagName = opening[1];
    const attributes = opening[2] ?? '';
    if (!hasClass(attributes, className)) continue;

    const innerStart = (opening.index ?? 0) + opening[0].length;
    const closing = new RegExp(`<\/${tagName}\s*>`, 'i');
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
  const srcset = readAttribute(attributes, 'srcset');
  return Boolean(srcset && srcset.split(',').filter(Boolean).length >= 2);
}

export function renderedTextFromHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(
      /<\/?(?:address|article|aside|blockquote|br|div|footer|h[1-6]|header|li|main|nav|ol|p|section|table|td|th|tr|ul)\b[^>]*>/gi,
      ' ',
    )
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_match, value) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    )
    .replace(/&#(\d+);/g, (_match, value) =>
      String.fromCodePoint(Number.parseInt(value, 10)),
    )
    .replace(/&(amp|lt|gt|quot|apos);/gi, (match, entity) => {
      const decoded = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
      };
      return decoded[entity.toLowerCase()] ?? match;
    })
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function inspectBuiltSite(html) {
  const renderedText = renderedTextFromHtml(html);
  const primaryNav = findContainers(html, 'nav').find(
    ({ attributes }) =>
      readAttribute(attributes, 'aria-label') === 'Primary navigation' &&
      !isExplicitlyHidden(attributes),
  );
  const navAnchors = primaryNav
    ? [...primaryNav.innerHtml.matchAll(/<a\b([^>]*)>/gi)].map((match) =>
        readAttribute(match[1] ?? '', 'href'),
      )
    : [];

  const hero = findContainers(html, 'section').find(
    ({ attributes }) => readAttribute(attributes, 'id') === 'top',
  );
  const eyebrow = hero
    ? findElementByClass(hero.innerHtml, 'hero__hello')
    : null;
  const role = hero ? findElementByClass(hero.innerHtml, 'hero__role') : null;
  const heroIdentityVisible = Boolean(
    hero &&
      !isExplicitlyHidden(hero.attributes) &&
      eyebrow &&
      !isExplicitlyHidden(eyebrow.attributes) &&
      renderedTextFromHtml(eyebrow.innerHtml) === "HELLO, I'M SHENG" &&
      role &&
      !isExplicitlyHidden(role.attributes) &&
      renderedTextFromHtml(role.innerHtml) === 'AI TRAINER IN PROGRESS',
  );

  const footer = findContainers(html, 'footer')[0];
  const footerValid = Boolean(
    footer &&
      !isExplicitlyHidden(footer.attributes) &&
      renderedTextFromHtml(footer.innerHtml) === expectedFooter,
  );

  const learning = findContainers(html, 'section').find(
    ({ attributes }) => readAttribute(attributes, 'id') === 'learning',
  );
  const learningList = learning
    ? findContainers(learning.innerHtml, 'ul').find(({ attributes }) =>
        hasClass(attributes, 'learning__grid'),
      )
    : null;
  const learningCards = learningList
    ? findContainers(learningList.innerHtml, 'li')
    : [];
  const learningStatusesValid =
    learningCards.length === expectedLearningCardCount &&
    learningCards.every(({ innerHtml }) => {
      const status = findElementByClass(innerHtml, 'learning__status');
      return Boolean(
        status &&
          !isExplicitlyHidden(status.attributes) &&
          renderedTextFromHtml(status.innerHtml) === '正在学习',
      );
    });

  const portrait = findContainers(hero?.innerHtml ?? '', 'picture').find(
    ({ innerHtml }) =>
      [...innerHtml.matchAll(/<img\b([^>]*)>/gi)].some(
        (match) =>
          readAttribute(match[1] ?? '', 'alt') === 'Sheng 的 3D IP 形象',
      ),
  );
  const portraitSources = portrait
    ? [...portrait.innerHtml.matchAll(/<source\b([^>]*)>/gi)].map(
        (match) => match[1] ?? '',
      )
    : [];
  const portraitImageAttributes = portrait
    ? [...portrait.innerHtml.matchAll(/<img\b([^>]*)>/gi)]
        .map((match) => match[1] ?? '')
        .find(
          (attributes) =>
            readAttribute(attributes, 'alt') === 'Sheng 的 3D IP 形象',
        )
    : null;
  const responsivePortraitValid = Boolean(
    portrait &&
      portraitSources.some(
        (attributes) =>
          readAttribute(attributes, 'type') === 'image/avif' &&
          hasResponsiveSrcset(attributes),
      ) &&
      portraitSources.some(
        (attributes) =>
          readAttribute(attributes, 'type') === 'image/webp' &&
          hasResponsiveSrcset(attributes),
      ) &&
      portraitImageAttributes &&
      /\.png(?:\?|$)/i.test(readAttribute(portraitImageAttributes, 'src') ?? '') &&
      Boolean(readAttribute(portraitImageAttributes, 'width')) &&
      Boolean(readAttribute(portraitImageAttributes, 'height')) &&
      Boolean(readAttribute(portraitImageAttributes, 'sizes')),
  );
  const canvasCount = (html.match(/<canvas\b/gi) ?? []).length;

  return {
    missing: required.filter((value) => !html.includes(value)),
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    foundForbidden: forbiddenLiterals.filter((value) =>
      html.toLowerCase().includes(value.toLowerCase()),
    ),
    hasFakePercentage: /\b\d{1,3}(?:\.\d+)?\s*%/.test(renderedText),
    hasExampleEmail:
      /\b(?:example|hello|name|yourname)@[\w.-]+\.[a-z]{2,}\b/i.test(
        renderedText,
      ),
    hasRemovedHeroChips:
      /<span[^>]*>\s*清晰\s*<\/span>\s*<span[^>]*>\s*准确\s*<\/span>\s*<span[^>]*>\s*有帮助\s*<\/span>/i.test(
        html,
      ),
    navAnchorsValid:
      navAnchors.length === expectedNavAnchors.length &&
      navAnchors.every((href, index) => href === expectedNavAnchors[index]),
    heroIdentityVisible,
    footerValid,
    learningStatusesValid,
    responsivePortraitValid,
    canvasCount,
  };
}

export function hasContractFailure(result) {
  return (
    result.missing.length > 0 ||
    result.h1Count !== 1 ||
    result.foundForbidden.length > 0 ||
    result.hasFakePercentage ||
    result.hasExampleEmail ||
    result.hasRemovedHeroChips ||
    !result.navAnchorsValid ||
    !result.heroIdentityVisible ||
    !result.footerValid ||
    !result.learningStatusesValid ||
    !result.responsivePortraitValid ||
    result.canvasCount !== 1
  );
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const result = inspectBuiltSite(html);

  if (hasContractFailure(result)) {
    console.error(result);
    process.exit(1);
  }

  console.log('Built-site contract verified.');
}
