#!/usr/bin/env node
/**
 * snapshot-models.mjs — histórico GLOBAL de modelos (o que a app não pode guardar sozinha).
 * - Fetch da lista de modelos do OpenRouter (fonte viva)
 * - Compara com docs/models/latest.json
 * - Append das mudanças (adicionados/removidos) em docs/models/history.json
 * - Escreve docs/models/latest.json (lista atual, compacta)
 * - Imprime um resumo para o GitHub Actions decidir se faz commit
 *
 * Node 18+ (fetch nativo). Sem dependências.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "docs", "models");
mkdirSync(DIR, { recursive: true });

const now = new Date();
const date = now.toISOString().slice(0, 10);

const res = await fetch("https://openrouter.ai/api/v1/models");
if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1); }
const j = await res.json();
const models = (j.data || [])
  .map(m => ({
    id: m.id,
    in: +(m.pricing?.prompt ?? 0),
    out: +(m.pricing?.completion ?? 0),
    context: m.context_length || null,
  }))
  .filter(m => m.in > 0 && m.out > 0)
  .sort((a, b) => a.id.localeCompare(b.id));

const latestPath = join(DIR, "latest.json");
let prev = [];
try { prev = JSON.parse(readFileSync(latestPath, "utf8")); } catch { /* primeiro run */ }

const prevIds = new Set(prev.map(m => m.id));
const curIds = new Set(models.map(m => m.id));
const added = models.filter(m => !prevIds.has(m.id)).map(m => m.id);
const removed = prev.filter(m => !curIds.has(m.id)).map(m => m.id);

const historyPath = join(DIR, "history.json");
let history = [];
try { history = JSON.parse(readFileSync(historyPath, "utf8")); } catch { /* primeiro run */ }
if (added.length || removed.length || !history.length) {
  history.push({ date, added, removed, total: models.length });
  if (history.length > 3650) history = history.slice(-3650);
  writeFileSync(historyPath, JSON.stringify(history, null, 1) + "\n");
}
writeFileSync(latestPath, JSON.stringify(models, null, 1) + "\n");

const sum = models.reduce((a, m) => a + m.in, 0);
console.log(`snapshot ${date}: ${models.length} models | added ${added.length} | removed ${removed.length} | median-in $${((sum / models.length) * 1e6).toFixed(3)}/M`);
if (added.length) console.log("ADDED: " + added.join(", "));
if (removed.length) console.log("REMOVED: " + removed.join(", "));
