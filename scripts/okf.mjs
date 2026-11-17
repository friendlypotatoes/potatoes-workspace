#!/usr/bin/env node
// OKF v0.2 template compiler — standalone port of the ohara workspace compiler's
// knowledge/templates -> answer-template semantics (parse, validate, compile; one way).
//
//   node scripts/okf.mjs          compile knowledge/templates/*.md -> knowledge/generated/answer-templates.json
//   node scripts/okf.mjs --check  compile only; fail if the committed generated file is stale
//
// OKF rules kept from the original (T23):
//   - a template is `type: Attested Computation` with a title and a `# Computation` code block
//   - a template without a human `verified` entry, or past `stale_after`, compiles with resolvable = false
//   - `:name` in the computation must be a declared parameter, context or constant
//   - an agent never verifies: `verified.by` must start with `human:` and carry a date
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUNDLE_DIR = join(ROOT, 'knowledge');
const OUT_FILE = join(BUNDLE_DIR, 'generated', 'answer-templates.json');

export class ConceptError extends Error {
  constructor(path, msg) { super(`${path}: ${msg}`); }
}

/** Splits `---` YAML frontmatter from the markdown body. */
export function splitConcept(path, text) {
  const m = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new ConceptError(path, 'no frontmatter');
  const fm = parseYaml(m[1]);
  if (!fm || typeof fm !== 'object') throw new ConceptError(path, 'frontmatter is not a mapping');
  return { fm, body: m[2] };
}

/** The `# Computation` section's code: a fenced block, or an indented block.
 *  The section end scan skips fenced code, so shell `#` comments inside a block are not read as a new section. */
export function computationOf(path, body) {
  const lines = body.split(/\r?\n/);
  const head = lines.findIndex((l) => /^# Computation[ \t]*$/.test(l));
  if (head < 0) throw new ConceptError(path, 'no "# Computation" section');
  const sec = [];
  let fence = null;
  for (const l of lines.slice(head + 1)) {
    const f = l.match(/^(```|~~~)/);
    if (f) { fence = fence === f[1] ? null : (fence ?? f[1]); sec.push(l); continue; }
    if (!fence && /^# /.test(l)) break;
    sec.push(l);
  }
  const s = sec.join('\n');
  const fenced = s.match(/```[a-z]*\r?\n([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const ind = s.split(/\r?\n/);
  const start = ind.findIndex((l) => /^( {4}|\t)\S/.test(l));
  if (start < 0) throw new ConceptError(path, '"# Computation" holds no code block');
  const block = [];
  for (const l of ind.slice(start)) {
    if (l.trim() === '') { block.push(''); continue; }
    if (!/^( {4}|\t)/.test(l)) break;
    block.push(l.replace(/^( {4}|\t)/, ''));
  }
  return block.join('\n').trim();
}

/** A concept is verified when a `human:` entry with a date says so. An agent never verifies. */
export const humanVerifier = (v) => {
  const list = Array.isArray(v) ? v : v ? [v] : [];
  return list.some((x) => typeof x?.by === 'string' && x.by.startsWith('human:') && x.at);
};

/** A scalar, a list or nothing, as a list: frontmatter writes all three. */
export const toArr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);

export function compileConcept(bundleDir, file, now = new Date()) {
  const path = relative(bundleDir, file).split(sep).join('/');
  const text = readFileSync(file, 'utf8');
  const { fm, body } = splitConcept(path, text);
  if (fm.type !== 'Attested Computation') throw new ConceptError(path, `type is ${fm.type}, not Attested Computation`);
  if (typeof fm.title !== 'string') throw new ConceptError(path, 'no title');
  const sql = computationOf(path, body);

  const parameters = toArr(fm.parameters).map((p) => {
    if (!p?.name || !/^[a-z_][a-z0-9_]*$/.test(p.name)) throw new ConceptError(path, `bad parameter ${JSON.stringify(p)}`);
    if ((p.type ?? 'string') !== 'string') throw new ConceptError(path, `parameter ${p.name}: only string parameters are supported`);
    return { name: p.name, type: 'string', required: p.required === true, resolve: p.resolve ?? 'none', description: p.description };
  });
  const context = toArr(fm.context);
  const a = fm.answer ?? {};
  const constants = {};
  for (const [k, v] of Object.entries(a.constants ?? {})) {
    if (!/^[a-z_][a-z0-9_]*$/.test(k) || (typeof v !== 'number' && typeof v !== 'string')) throw new ConceptError(path, `bad constant ${k}`);
    constants[k] = v;
  }
  const declared = new Set([...parameters.map((p) => p.name), ...context, ...Object.keys(constants)]);
  for (const m of sql.matchAll(/(?<!:):([a-z_][a-z0-9_]*)/g)) {
    if (!declared.has(m[1])) throw new ConceptError(path, `Computation uses :${m[1]} which is neither a parameter, context nor a constant`);
  }

  const answer = {
    shape: a.shape === 'marks' ? 'marks' : 'table',
    headline: { value: 'count', unit: a.headline?.unit ?? 'rows', label: a.headline?.label ?? fm.title },
    columns: toArr(a.columns),
    row_id: a.row_id ?? 'id',
    ...(a.mark_by ? { mark_by: a.mark_by } : {}),
    ...(a.window_days ? { window_days: Number(a.window_days) } : {}),
    ...(a.sub ? { sub: a.sub } : {}),
    ...(Object.keys(constants).length ? { constants } : {}),
    ...(a.never_say ? { never_say: toArr(a.never_say).map(String) } : {}),
  };

  const verified = humanVerifier(fm.verified);
  const staleAfter = fm.stale_after ? new Date(fm.stale_after) : null;
  const stale = staleAfter !== null && now >= staleAfter;
  const reason = !verified ? 'no human verified entry (T23)' : stale ? `past stale_after ${staleAfter.toISOString()} (T23)` : null;
  const generatedAt = fm.generated?.at ? new Date(fm.generated.at).toISOString() : 'unknown';
  const slug = basename(file, '.md');

  return {
    id: `tpl.${slug.replace(/-/g, '_')}`,
    version: generatedAt,
    concept_path: path,
    title: fm.title,
    question_patterns: toArr(fm.question_patterns),
    params_schema: { parameters },
    context,
    computation: sql,
    reads: [...new Set(toArr(fm.reads))].sort(),
    classes_touched: toArr(fm.classes_touched),
    answer_spec: answer,
    followups: toArr(fm.followups).map((f) => ({ template: `tpl.${String(f.template).replace(/-/g, '_')}`, params: f.params ?? {}, text: String(f.text ?? '') })),
    verified,
    stale_after: staleAfter ? staleAfter.toISOString() : null,
    resolvable: reason === null,
    unresolvable_reason: reason,
    concept_sha256: createHash('sha256').update(text).digest('hex'),
  };
}

/** Every template in `<bundle>/templates/`. */
export function compileTemplates(bundleDir = BUNDLE_DIR, now = new Date()) {
  const dir = join(bundleDir, 'templates');
  return readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
    .map((f) => compileConcept(bundleDir, join(dir, f), now));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const rows = compileTemplates();
  for (const r of rows) {
    console.log(`${r.resolvable ? 'resolvable  ' : 'NOT resolvable'}  ${r.id}  (${r.concept_path})${r.unresolvable_reason ? ` — ${r.unresolvable_reason}` : ''}`);
  }
  const json = JSON.stringify(rows, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    let current = '';
    try { current = readFileSync(OUT_FILE, 'utf8'); } catch { /* missing counts as stale */ }
    if (current !== json) {
      console.error('knowledge/generated/answer-templates.json is stale — run `node scripts/okf.mjs`');
      process.exit(1);
    }
    console.log(`OK: ${rows.length} template(s), generated file up to date.`);
  } else {
    mkdirSync(dirname(OUT_FILE), { recursive: true });
    writeFileSync(OUT_FILE, json);
    console.log(`Wrote ${rows.length} template(s) to knowledge/generated/answer-templates.json`);
  }
}
