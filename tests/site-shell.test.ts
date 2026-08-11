import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const builtHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

describe('built site shell', () => {
  it('provides a target for every local anchor', () => {
    const localHrefs = [...builtHtml.matchAll(/href="(#[^"]+)"/g)].map((match) => match[1]);

    for (const href of localHrefs) {
      expect(builtHtml).toContain(`id="${href.slice(1)}"`);
    }
  });
});
