#!/usr/bin/env node
/**
 * check-i18n.js — garante a norma i18n: qualquer funcionalidade nova tem chaves
 * em EN (norma) e reporta as que faltam nas outras línguas (caem para EN até traduzidas).
 * Uso: node check-i18n.js   (corre contra index.html)
 * Exit 0 = norma respeitada. Exit 1 = violação (chaves, esc(), placeholders, duplicados…).
 */
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("script block not found"); process.exit(1); }
const js = m[1];
// converte um índice dentro de js na linha real do index.html (o script começa a meio do ficheiro)
const jsLine = idx => html.slice(0, m.index).split("\n").length - 1 + js.slice(0, idx).split("\n").length;

// ---- 0) parsear o dicionário T: {língua: {chave: valor, seen: contagem}} ----
const tm = js.match(/const T = \{([\s\S]*?)\n\};/);
if (!tm) { console.error("T dictionary not found"); process.exit(1); }
const tSrc = tm[0];
const langs = {};
const langRe = /^\s*([A-Za-z0-9_]{2,}):\{([\s\S]*?)\n\},?/gm;
let l;
while ((l = langRe.exec(tSrc))) {
  const name = l[1], body = l[2];
  const values = {}, seen = {};
  const keyRe = /([A-Za-z0-9_]+):"((?:[^"\\]|\\.)*)"/g;
  let k;
  while ((k = keyRe.exec(body))) { values[k[1]] = k[2]; seen[k[1]] = (seen[k[1]] || 0) + 1; }
  langs[name] = { values, seen };
}
if (!langs.en) { console.error("en block not found"); process.exit(1); }

let fail = 0;

// ---- 0b) línguas declaradas em LANGUAGES vs blocos do dicionário ----
const lm = js.match(/const LANGUAGES = \{([\s\S]*?)\};/);
const declared = new Set();
if (lm) {
  const lcRe = /([A-Za-z0-9_]{2,}):/g;
  let c;
  while ((c = lcRe.exec(lm[1]))) declared.add(c[1]);
}
if (declared.size) {
  const noBlock = [...declared].filter(c => !langs[c]);
  const noDecl = Object.keys(langs).filter(c => !declared.has(c));
  if (noBlock.length) { fail = 1; console.error(`❌ língua em LANGUAGES sem bloco no dicionário: ${noBlock.join(", ")}`); }
  if (noDecl.length) { fail = 1; console.error(`❌ bloco no dicionário sem declaração em LANGUAGES: ${noDecl.join(", ")}`); }
}

// ---- 0c) chaves duplicadas dentro do mesmo bloco ----
for (const lang of Object.keys(langs)) {
  const dups = Object.entries(langs[lang].seen).filter(([, n]) => n > 1).map(([k]) => k);
  if (dups.length) { fail = 1; console.error(`❌ ${lang}: chaves duplicadas (a última vence em runtime): ${dups.join(", ")}`); }
}

// ---- 0d) chaves órfãs: existem numa língua mas não em EN ----
for (const lang of Object.keys(langs)) {
  if (lang === "en") continue;
  const orphans = Object.keys(langs[lang].values).filter(k => !(k in langs.en.values));
  if (orphans.length) { fail = 1; console.error(`❌ ${lang}: chaves órfãs (não existem em EN): ${orphans.join(", ")}`); }
}

// ---- 0e) placeholders {x} consistentes entre EN e cada língua ----
const ph = v => [...new Set((v.match(/\{(\w+)\}/g) || []))].sort().join(",");
for (const lang of Object.keys(langs)) {
  if (lang === "en") continue;
  const mism = Object.keys(langs.en.values).filter(k =>
    langs[lang].values[k] !== undefined && ph(langs.en.values[k]) !== ph(langs[lang].values[k]));
  if (mism.length) { fail = 1; console.error(`❌ ${lang}: placeholders divergentes de EN: ${mism.join(", ")}`); }
}

// ---- 1) chaves data-i18n existem em EN ----
const used = new Set();
const attrRe = /data-i18n="([^"]+)"/g;
let a;
while ((a = attrRe.exec(html))) used.add(a[1]);
const missingAttr = [...used].filter(k => !(k in langs.en.values));
if (missingAttr.length) {
  fail = 1;
  console.error(`❌ data-i18n sem chave EN: ${missingAttr.join(", ")}`);
}

// ---- 2) chaves literais usadas em t("...") / t('...') / t(`...`) existem em EN ----
const tKeys = new Set();
const tRe = /\bt\s*\(\s*["'`]([A-Za-z0-9_]+)["'`]/g;
let tk;
while ((tk = tRe.exec(js))) tKeys.add(tk[1]);
const missingT = [...tKeys].filter(k => !(k in langs.en.values));
if (missingT.length) {
  fail = 1;
  console.error(`❌ t("...") sem chave EN: ${missingT.join(", ")}`);
}

// ---- 2b) chaves table-driven: literais nas tabelas (DIMENSIONS, IMPROVEMENT_PATTERNS,
// quiz, LEVELS, DOMAINS, blurbs) chegam ao t() por variável e são invisíveis à regra 2 ----
const tableKeys = new Set();
const tabRe = /"((?:dim|dom|imp|quiz|lv|blurb)_[A-Za-z0-9_]+)"/g;
let tb;
while ((tb = tabRe.exec(js))) tableKeys.add(tb[1]);
const missingTable = [...tableKeys].filter(k => !(k in langs.en.values));
if (missingTable.length) {
  fail = 1;
  console.error(`❌ chave table-driven sem chave EN: ${missingTable.join(", ")}`);
}

// ---- 3) interpolação em atributos HTML perigosos SEM esc() → injeção (regressão conhecida) ----
// apanha ${ em QUALQUER posição do valor (value="x${a}", 2.º slot de "${esc(a)} ${b}");
// o lookbehind evita falsos positivos tipo data-value="..."
const attrUnescaped = [];
const attrInterpRe = /(?<![-\w])(?:value|title|placeholder|alt|download|href)="[^"]*?\$\{(?!esc\(|t\()/g;
let ai;
while ((ai = attrInterpRe.exec(js))) {
  attrUnescaped.push(`linha ${jsLine(ai.index)}: ${js.slice(ai.index, ai.index + 50).split("\n")[0].trim()}`);
}
if (attrUnescaped.length) {
  fail = 1;
  console.error(`❌ ${attrUnescaped.length} interpolação(ões) em atributo sem esc() (injeção):\n  ` + attrUnescaped.join("\n  "));
}

// ---- 3b) conteúdo: interpolações de identificadores puros sem esc()/t() → warn ----
// CONTENT_ALLOW: expressões revistas manualmente como seguras (internas, nunca texto de
// utilizador). Conteúdo dinâmico novo fora desta lista deve usar esc()/t() — ou ser
// acrescentado aqui APÓS revisão. Em árvore limpa este bloco não emite nenhum aviso.
const CONTENT_ALLOW = new Set(["h.adjusted", "labelsSvg", "d.color", "d.id", "snap.date", "el.dataset.dim", "st.added", "st.gone"]);
const NUMERIC = new Set(["i", "j", "k", "n", "x", "y", "r", "R", "C", "w", "h", "s", "v", "c", "t", "cx", "cy", "p", "b", "sum", "total", "nth", "len", "idx", "id", "donut", "radar", "data", "grid", "spokes", "dots", "opts", "ranked", "prov", "adj", "adjTxt", "tips", "dims", "crit", "imp", "list", "row"]);
const contentWarn = [];
const contentRe = /\$\{([A-Za-z_$][\w$.]{0,40})\}/g;
let ci;
while ((ci = contentRe.exec(js))) {
  const expr = ci[1].trim();
  if (CONTENT_ALLOW.has(expr) || NUMERIC.has(expr) || /^[0-9]/.test(expr) || /\.toFixed|\.length|\.value|\.innerHTML|\.textContent/.test(expr)) continue;
  contentWarn.push(`linha ${jsLine(ci.index)}: \${${expr.slice(0, 40)}}`);
}
if (contentWarn.length) {
  console.log(`⚠️  ${contentWarn.length} interpolação(ões) de variável em conteúdo sem esc() (rever — potencial injeção):\n  ` + contentWarn.slice(0, 8).join("\n  ") + (contentWarn.length > 8 ? "\n  …" : ""));
}

// ---- 4) todas as chaves EN existem nas outras línguas. PT é norma obrigatória (falha);
// nas restantes reporta apenas — fallback EN é válido ----
for (const lang of Object.keys(langs)) {
  if (lang === "en") continue;
  const missing = Object.keys(langs.en.values).filter(k => !(k in langs[lang].values));
  if (missing.length && lang === "pt") {
    fail = 1;
    console.error(`❌ pt: ${missing.length} chaves em falta (norma EN+PT obrigatória): ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`);
  } else if (missing.length) {
    console.log(`⚠️  ${lang}: ${missing.length} chaves em fallback EN (${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""})`);
  } else {
    console.log(`✅ ${lang}: completo (${Object.keys(langs.en.values).length} chaves)`);
  }
}
console.log(`✅ EN: ${Object.keys(langs.en.values).length} chaves | data-i18n usadas: ${used.size} | t() literais: ${tKeys.size} | línguas: ${Object.keys(langs).join("/")}`);
if (!fail) console.log("i18n OK — norma respeitada.");
process.exit(fail);
