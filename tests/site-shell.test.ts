import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';

function collectAstroFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory()) return collectAstroFiles(path);
    return entry.name.endsWith('.astro') ? [path] : [];
  });
}

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));
const literalIds = new Set(
  collectAstroFiles(sourceDirectory).flatMap((path) =>
    [...readFileSync(path, 'utf8').matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/g)].map(
      (match) => match[1] ?? match[2],
    ),
  ),
);

describe('site shell source', () => {
  it('provides a literal target for every profile navigation anchor', () => {
    for (const { href } of profile.nav) {
      expect(literalIds).toContain(href.slice(1));
    }
  });
});
