/**
 * Checks that the HTML->Lexical conversion in the content import did not quietly drop
 * anything: inline formatting, links and list structure are the parts most likely to be
 * lost, and the loss would be invisible until someone opened the page.
 *
 * Needs `pnpm dev` running. Run: node .claude/scripts/verify-import.mjs
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:8000';

const kinds = new Map();
const formats = new Map();
const links = [];
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);

function walk(node) {
  if (!node || typeof node !== 'object') return;
  const type = node.type;
  if (typeof type === 'string') bump(kinds, type);
  if (type === 'text' && node.format) bump(formats, node.format);
  if (type === 'link' || type === 'autolink') links.push(node.fields?.url ?? '(no url)');
  for (const child of node.children ?? []) walk(child);
}

const res = await fetch(`${BASE}/api/events?limit=100&depth=0`);
if (!res.ok) throw new Error(`GET /api/events -> ${res.status}. Is pnpm dev running?`);
const { docs } = await res.json();

let introCount = 0;
let descCount = 0;
for (const doc of docs) {
  if (doc.intro?.root) {
    walk(doc.intro.root);
    introCount++;
  }
  for (const block of doc.agenda ?? []) {
    if (block.description?.root) {
      walk(block.description.root);
      descCount++;
    }
  }
}

const FORMAT_NAMES = { 1: 'bold', 2: 'italic', 4: 'strikethrough', 8: 'underline', 9: 'bold+underline' };

console.log(`${docs.length} events; ${introCount} intros and ${descCount} talk descriptions carry rich text\n`);
console.log('lexical node types:');
for (const [k, n] of [...kinds].sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(12)} ${n}`);
console.log('\ninline formatting on text nodes:');
if (formats.size === 0) console.log('  NONE — bold/italic/underline were lost in conversion');
for (const [f, n] of [...formats].sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(FORMAT_NAMES[f] ?? f).padEnd(14)} ${n}`);
console.log(`\nlinks preserved: ${links.length}`);
for (const u of links.slice(0, 8)) console.log(`  ${u}`);

const missing = [];
if (!kinds.has('link')) missing.push('link');
if (!kinds.has('list')) missing.push('list');
if (formats.size === 0) missing.push('inline formatting');
console.log(
  missing.length
    ? `\n⚠ not found in the converted output: ${missing.join(', ')}`
    : '\nAll of link, list and inline formatting survived.',
);
