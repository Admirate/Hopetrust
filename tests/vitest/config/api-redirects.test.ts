import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The site is `output: 'export'` — a static bundle with no Next API routes at
// all. Every `/api/...` the client fetches therefore has to be routed to a
// Netlify function by netlify.toml, or it falls through to the catch-all and
// returns 404. That failure is invisible to the rest of the suite: the function
// tests call the handler directly and the component tests mock fetch, so both
// stay green while the path between them is broken in production.
const toml = readFileSync('netlify.toml', 'utf8');

const routed = new Set(
  [...toml.matchAll(/^\s*from\s*=\s*"(\/api\/[^"]+)"/gm)]
    // A commented-out redirect is not a redirect.
    .filter((m) => !/^\s*#/.test(m[0]))
    .map((m) => m[1])
);

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'out') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(full);
  }
  return out;
}

// Commented-out code is not a call. WhatsAppButton keeps a disabled fetch to
// `/api/whatsapp-crm` behind `//`, and reporting that as an unrouted path would
// make this test cry wolf about a line nothing executes.
function stripComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .filter((line) => !/^\s*(\/\/|\*)/.test(line))
    .join('\n');
}

const fetched = new Map<string, string>();
for (const dir of ['components', 'app', 'lib']) {
  let files: string[] = [];
  try { files = sourceFiles(dir); } catch { continue; }
  for (const file of files) {
    const text = stripComments(readFileSync(file, 'utf8'));
    for (const m of text.matchAll(/fetch\(\s*['"`](\/api\/[^'"`?]+)/g)) {
      if (!fetched.has(m[1])) fetched.set(m[1], file);
    }
  }
}

describe('netlify.toml routes every /api path the client calls', () => {
  it('finds at least one /api fetch to check', () => {
    expect(fetched.size).toBeGreaterThan(0);
  });

  it('routes each one to a function', () => {
    const unrouted = [...fetched.entries()]
      .filter(([path]) => !routed.has(path))
      .map(([path, file]) => `${path}  (fetched in ${file})`);
    expect(unrouted).toEqual([]);
  });
});
