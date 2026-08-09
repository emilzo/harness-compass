#!/usr/bin/env node
/**
 * check-i18n.js — garante a norma i18n: qualquer funcionalidade nova tem chaves
 * em EN (norma) e reporta as que faltam nas outras línguas (caem para EN até traduzidas).
 * Uso: node check-i18n.js   (corre contra index.html)
 * Exit 0 = EN completo e nenhum data-i18n órfão. Exit 1 = faltam chaves.
 */
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error("script block not found"); process.exit(1); }
const js = m[1];

// extrair const T = {...}
const tm = js.match(/const T = \{([\s\S]*?)\n\};/);
if (!tm) { console.error("T dictionary not found"); process.exit(1); }
const tSrc = tm[0];
const langs = {};
const langRe = /^\s*([a-z]{2}):\{([\s\S]*?)\n\},/gm;
let l;
while ((l = langRe.exec(tSrc))) {
  const name = l[1], body = l[2];
  const keys = {};
  const keyRe = /([A-Za-z0-9_]+):"(?:[^"\\]|\\.)*"/g;
  let k;
  while ((k = keyRe.exec(body))) keys[k[1]] = true;
  langs[name] = keys;
}
if (!langs.en) { console.error("en block not found"); process.exit(1); }

let fail = 0;
// 1) chaves data-i18n existem em EN
const used = new Set();
const attrRe = /data-i18n="([^"]+)"/g;
let a;
while ((a = attrRe.exec(html))) used.add(a[1]);
const missingAttr = [...used].filter(k => !langs.en[k]);
if (missingAttr.length) {
  fail = 1;
  console.error(`❌ data-i18n sem chave EN: ${missingAttr.join(", ")}`);
}

// 2) todas as chaves EN existem nas outras línguas (reporta, não falha — fallback EN é válido)
for (const lang of Object.keys(langs)) {
  if (lang === "en") continue;
  const missing = Object.keys(langs.en).filter(k => !langs[lang][k]);
  if (missing.length) {
    console.log(`⚠️  ${lang}: ${missing.length} chaves em fallback EN (${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""})`);
  } else {
    console.log(`✅ ${lang}: completo (${Object.keys(langs.en).length} chaves)`);
  }
}
console.log(`✅ EN: ${Object.keys(langs.en).length} chaves | data-i18n usadas: ${used.size}`);
if (!fail) console.log("i18n OK — norma respeitada.");
process.exit(fail);
