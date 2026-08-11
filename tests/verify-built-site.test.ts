import { describe, expect, it } from 'vitest';
import {
  inspectBuiltSite,
  renderedTextFromHtml,
} from '../scripts/verify-built-site.mjs';

describe('built-site verifier', () => {
  it('rejects a percentage claim embedded in visible copy', () => {
    const result = inspectBuiltSite('<p>AI 熟练度 90%</p>');

    expect(result.hasFakePercentage).toBe(true);
  });

  it('ignores non-rendered percentages in scripts and styles', () => {
    const html = `
      <style>.meter { width: 90%; }</style>
      <script>const completion = '95%';</script>
      <p>持续练习，不使用能力百分比。</p>
    `;

    expect(renderedTextFromHtml(html)).toBe('持续练习，不使用能力百分比。');
    expect(inspectBuiltSite(html).hasFakePercentage).toBe(false);
  });
});
