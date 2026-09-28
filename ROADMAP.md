# Harness Compass — Roadmap

**English** · [Português](ROADMAP.pt.md)

Legend: `[x]` = done and verified · `[ ]` = to do
Last update: 2026-09-28 · Code status: `npm test` (`check-i18n.js` + `test/regression.mjs`) · HCI 0–100 (rubric v1) · **Live: https://emilzo.github.io/harness-compass/** · A previous "Lighthouse 98/100/100/100" line had no report in this repo and is removed.

## Phase 0 — Foundation ✅
- [x] Single-file app, works offline (`index.html`; jsdom only as a test devDependency)
- [x] Taxonomy: 6 domains × 22 dimensions (`references/harness-map.md`)
- [x] Ranking with scores, HCI (Harness Compass Index) and provenance badges
- [x] Taxonomy map (interactive A–F view)
- [x] Weighted recommendation quiz
- [x] Cost calculator + modelled monthly cost view (illustrative, two labelled results). Not a measured cost per task.
- [x] Live OpenRouter prices at runtime (no credentials, CORS-friendly)
- [x] Local in-browser audit: reads up to 300 files from a folder, 100% local, no upload
- [x] JSON export with original heuristic + adjusted-dimensions counter
- [x] AGPL-3.0 license + full README

## Phase 1 — Globalization ✅
- [x] Complete EN + PT i18n
- [x] FR/DE/ZH/HI dictionaries. An earlier "6 languages at 330/330 keys, no EN fallback" claim was wrong (`check-i18n.js` did not require those four languages to be complete). Do not freeze a key count. Run `node check-i18n.js`.
- [x] 6-language selector + persistence (localStorage) + automatic EN fallback
- [x] `check-i18n.js` as a mandatory norm — EN **and PT** keys (exit 1 if missing), table-driven keys (dim/imp/quiz/lv/blurb/dom), placeholders consistent across languages, orphans, duplicates, `LANGUAGES` vs dictionary blocks, `esc()` in attributes, content allowlist with zero warnings
- [x] Light/dark theme with persistence and fixed contrast (incl. donut/radar on theme variables)
- [x] Branding: compact compass mark · footer credit with `@emilzo`

## Phase 2 — Constancy, Integrity & Hardening ✅
- [x] Local snapshot + model diff (🆕 new / 📦 removed since last visit)
- [x] Local history of discontinued models (name, date, last price)
- [x] `scripts/snapshot-models.mjs` + GitHub Actions workflow (daily cron)
- [x] `docs/models/` dataset (378 real models with prices — first snapshot)
- [x] External reviews closed: 15 findings + 6 new (N1–N6) + a final 21-finding triple check — all fixed with verification
- [x] jsdom regression suite in `test/regression.mjs` (quiz, language replay, audit, cache, picker, re-entrancy, OpenRouter widgets, CTA, pills, SVG theme, keyboard, retranslatable status, dataset enforcement audited→evidence, modelled cost, audited-only default ranking). An earlier "23/23" status line is outdated. Do not freeze a count here.
- [x] CI (`.github/workflows/ci.yml`): `npm test` (check-i18n + suite) on every push/PR
- [x] Privacy verified: Clear releases cache/meta/closures (~2 MB); picker re-entrancy safe
- [x] Accessibility: `main` landmark, aria-labels, keyboard on tables, `prefers-reduced-motion` (CSS + JS), `for=` labels. A previous "Lighthouse A11y 100" claim had no report in this repo and is removed.
- [x] SEO/social: meta description, Open Graph + Twitter Card, 1200×630 social card, favicon, dynamic theme-color
- [x] **Saturation-proof scale (pre-launch decision):** HCI displayed **0–100** (dimensions keep the 0–10 rubric, now **v1**). A 10 is still unmet (formal verification, measured learning, a reviewed B1–B8 run, cost optimality against a baseline). Scores of 9 exist: Hermes Agent A2, C1, F3; T3 Code C1, C3. Best current HCI: 75. Future re-norming is versioned (v2, never silent). The long-term difficulty curve lives in the versioned B1–B8 scenarios.

## Phase 3 — Publication ✅ (site live 2026-08-10; anchor article pending)
- [x] **Evidence decision (external review P0) — resolved:** Hermes report **published in full in English and Portuguese** (`docs/DEEP-HARNESS-AUDIT-HERMES.en.md` + Portuguese original) · Kando is the author's own product (DevFactoryAI) and is **not ranked** until a public audit exists. Public summary: `docs/EVIDENCE-SUMMARY-KANDO.md`. The line-by-line report is private.
- [x] `evidence` field on `audited:true` harnesses — the audit line in the detail card links to the report
- [x] **Submission confidentiality policy** (README §Integrity 5 + BENCHMARK-SPEC §5): submitters may request a private audit — report goes only to the submitter, outside the public ranking/leaderboard; the public badge requires published evidence
- [x] GitHub repo + push (`emilzo/harness-compass`) with history cleaned of internal docs
- [x] GitHub Pages live via Actions, gated by `npm test` (no green, no deploy)
- [x] `og:url`/`og:image`/`REPO_URL` confirmed against the real URL
- [x] Gate 2 on the public URL: OpenRouter loading 377 real models over HTTPS, modern folder picker active, badge evidence reachable, Actions green
- [x] Launch assets: 16 screenshots (8 views × 2 themes, regenerated post-fixes) in `launch-assets/` + social card in `docs/social-card.png`
- [x] EN-first README (`README.md`) + preserved Portuguese (`README.pt.md`)
- [x] Internal docs out of the public repo (`internal/`, gitignored) — history rewritten before any forks existed
- [ ] Daily model-snapshot cron: the workflow on this branch no longer pushes to `main`. When `docs/models` changes it opens or updates a pull request (`models-snapshot` into `main`). The schedule still uses the workflow file on `main`, so this starts after merge. With the default token the required `test` check waits until a person approves the workflow run. Auto-merge is off. The snapshot committed in git remains 2026-08-09 until that pull request is merged.
- [ ] Decide whether `launch-assets/` (16 screenshots, ~2 MB) enters git — deliberately local today; version it if marketing runs from the public repo
- [ ] EN anchor article (Show HN + blog) — launch copy drafted in `launch-assets/launch-copy.md`
- [ ] Short landing page as a funnel — the Compass itself is the anchor product; a separate formal landing does not exist yet

## Phase 3.5 — Structure (after launch, never on launch eve)
- [ ] Split the monolith without a build step: `index.html` + `assets/data.js` + `assets/i18n.js` + `assets/app.js` (`file://` keeps working; suite adapts via `JSDOM.fromFile`)
- [x] **Pre-launch submission funnel** (pulled forward from 3.5 — a visitor who audits their own repo has a path after Export):
  - [x] `CONTRIBUTING.md` with the 3 tracks (public audit → AUDITED · private confidential · estimate via PR)
  - [x] `docs/audits/AUDIT-TEMPLATE.md` (22 dims, `path:line` evidence, declared coverage, public/private choice)
  - [x] "Submit your harness" issue form (`.github/ISSUE_TEMPLATE/submit-harness.yml`) + PR template with integrity checklist
  - [x] Submission hint on the audit card (au_submit, 6 languages) pointing to the issue form
  - [x] Suite test 23: every `audited:true` HAS `evidence` and the file exists (the rule becomes a CI gate)
- [x] **Semi-automated audit pipeline** (`.claude/skills/audit-harness` + `.claude/workflows/audit-harness.js`): submission → clone/pin SHA → 6 domains in parallel → template consolidation → adversarial citation verification → draft; the human only does the **15–30 min sign-off** (spot-check ≥3 citations + approval, batchable) — the human gate is never removed
- [ ] (optional, UI) "Prepare submission" button on the local audit: downloads preliminary JSON + prefilled template, always `audited:false`
- [ ] Formal harness JSON schema
- [ ] **Data i18n** (post-launch i18n sprint): builtin harness `type` and `tags` as translatable keys — today they stay EN in the detail card in every language (the most visible remaining multi-language gap; blurbs are already keys)

## Phase 4 — Credibility & Benchmark 🚧
- [ ] B1–B8 scenario runner (standalone Python — see `BENCHMARK-SPEC.md`; does not exist yet)
- [ ] B1–B8 leaderboard with real submissions
- [ ] First external audit via PR (the pipeline exists; the external flow has not been exercised)
- [ ] AUDITED seal + formal submission terms
- [ ] Legal terms: brand protection, data retention, telemetry consent

## Phase 5 — Traction & Revenue 🚧
- [ ] Technical channels: Hacker News, Reddit, dev.to
- [ ] Business channels: LinkedIn, Substack
- [ ] First free consultation (30–45 min) as a diagnostic funnel
- [ ] Paid plan: cost optimization / implementation / audit / monitoring
- [ ] Full temporal continuity: published results pinned to the exact model version

## Future triggers (decide when they happen, not before)
- [ ] **Ranking scale** — trigger ~30–50 entries: search + pagination in the table and tiers as separate views (Audited/Benchmarked/Estimates). Architecture note: the local audit is private and ephemeral (session memory, no upload) — the shared ranking ONLY grows through the editorial pipeline, so "thousands of rows" cannot happen by accident
- [ ] **Written notability policy** — trigger: submission queue > sign-off capacity. The ranking is a curated architecture maturity scorecard, not a directory: entries need real-world usage / identifiable vendor / living project; the rest lives in the local audit or as unlisted estimates. Tied scores are separated by the B1–B8 behaviour benchmark when that runner exists, not by more rows.
- [ ] Data as data (`data/harnesses/*.json`, `locales/*.json`) — trigger: first real external contribution
- [ ] Vite + TypeScript + render-from-state migration — trigger: leaderboard / team growth
- [ ] Product decision still open: whether to lower the `min()` caps in `harnessEff` (cache 0.85, avoided failures 0.60, compression 0.60, routing 0.95). Those caps are unchanged. With the current coefficients the reachable rates are cache up to 70%, avoided failures up to 50%, compression up to 45%, and routing from 0% to 65% (`0.65 × A1/10`, no 30% floor). UI text states both the reachable rates and the unused caps.

## Recorded without fixing (minor, documented in the reviews)
- `md_stable` shows the last-visit date, not the true start of stability
- Negative savings in the calculator without a warning (inverted inputs; it's illustrative)
- Repeated "+ Add to ranking" creates duplicate local entries (by design)
- `applyI18n` runs up to 3× per language switch (micro perf; no visible impact)
