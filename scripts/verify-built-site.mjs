import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

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

const missing = required.filter((value) => !html.includes(value));
const h1Count = (html.match(/<h1\b/gi) ?? []).length;
const foundForbidden = forbiddenLiterals.filter((value) =>
  html.toLowerCase().includes(value.toLowerCase()),
);
const hasFakePercentage = />\s*\d{1,3}\s*%\s*</.test(html);
const hasExampleEmail =
  /\b(?:example|hello|name|yourname)@[\w.-]+\.[a-z]{2,}\b/i.test(html);
const hasRemovedHeroChips =
  /<span[^>]*>\s*清晰\s*<\/span>\s*<span[^>]*>\s*准确\s*<\/span>\s*<span[^>]*>\s*有帮助\s*<\/span>/i.test(
    html,
  );

if (
  missing.length > 0 ||
  h1Count !== 1 ||
  foundForbidden.length > 0 ||
  hasFakePercentage ||
  hasExampleEmail ||
  hasRemovedHeroChips
) {
  console.error({
    missing,
    h1Count,
    foundForbidden,
    hasFakePercentage,
    hasExampleEmail,
    hasRemovedHeroChips,
  });
  process.exit(1);
}

console.log('Built-site contract verified.');
