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

export function renderedTextFromHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function inspectBuiltSite(html) {
  const renderedText = renderedTextFromHtml(html);

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
  };
}

export function hasContractFailure(result) {
  return (
    result.missing.length > 0 ||
    result.h1Count !== 1 ||
    result.foundForbidden.length > 0 ||
    result.hasFakePercentage ||
    result.hasExampleEmail ||
    result.hasRemovedHeroChips
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
