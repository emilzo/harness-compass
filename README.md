# 🧭 Harness Compass

**English** · [Português](README.pt.md)

**Live: https://emilzo.github.io/harness-compass/**

**Agent = Model + Harness.** The harness is everything that isn't the model: guides, loop, tools, permissions, sandbox, verification, observability, cost. This project helps you **choose the right harness** — and realize that with a powerful harness, **cheap LLMs get there**.

> "Loops coordinate. Harnesses guide, execute, verify and decide. Models generate."

## What it is

A single-page web app (zero runtime dependencies, zero build — jsdom exists only as a devDependency of the test suite) with 8 views:

1. **Paradigm** — why the harness decides how much of your token money is wasted.
2. **Ranking** — harnesses scored across **22 dimensions** with the **HCI (Harness Compass Index) 0–100** (dimensions scored 0–10 on maturity rubric **v1**, with frontier anchors: the 9–10 band requires criteria no current harness meets — today's best sits at 75), radar fingerprint and donut; sortable, filterable by domain and by provenance (integrity). AUDITED / PRELIMINARY / ESTIMATE / LOCAL always distinguished.
3. **💰 Real cost** — *Same Model, Different Harness*: the same workload, the same model, through each harness → **real cost per task (harness-adjusted)** with cache/retry/routing derived from the scores, live OpenRouter prices and a cost ranking. It's Artificial Analysis' "Cost per Task" applied to the layer.
4. **Harness Map** — the full taxonomy (6 domains × 22 dimensions).
5. **📂 Audit a folder** — open a local repo folder; heuristic analysis of the 22 dimensions with justifications, adjustable sliders (adjustments stay flagged — integrity), improvement plan, add-to-ranking and JSON export. 100% local.
6. **Decision quiz** — 6 questions weight the dimensions by your profile and recommend the top 3 with justification.
7. **Savings calculator** — how much you save per month in tokens with cache, retry, compression and routing.
8. **Method & evidence** — maturity scale, integrity, how the local audit works, case studies.

The **standardized benchmark** (the "ARC of harnesses" — B1–B8 scenarios, submission protocol, leaderboard) is specified in `BENCHMARK-SPEC.md` — the authority-play roadmap.

## Compatibility

| Feature | Chrome / Edge | Firefox | Safari | Note |
|---|---|---|---|---|
| Ranking, map, quiz, calculator, charts | ✅ | ✅ | ✅ | Standard HTML/CSS/JS, zero dependencies |
| Folder audit (modern picker) | ✅ | — | — | Requires HTTPS (GitHub Pages) or localhost |
| Folder audit (classic fallback) | ✅ | ✅ | ⚠️ partial | Safari does not reliably return folder hierarchies |
| `file://` (double-click) | ✅ (fallback) | ✅ | ✅ | The modern picker falls back to the classic one automatically |

**Mac, Windows, Linux:** identical behavior — the APIs depend on the browser, not the OS. For the best folder-audit experience: **Chrome or Edge on the GitHub Pages deployment** (HTTPS).

## How to use

```bash
# 0. Or just open the live app: https://emilzo.github.io/harness-compass/

# 1. Open in any browser (double-click works — it's a single file):
open index.html        # macOS / Linux
start index.html       # Windows

# 2. Or publish to GitHub Pages: push the repo → Settings → Pages → main branch
```

## The paradigm (the thesis)

The price of an LLM is not the model's price — it's the model's price **times the harness's waste**:

- No byte-stable caching → you pay for the same prefix over and over.
- No smart retry/fallback → transient failures become dead calls and dev time.
- No compression → long conversations blow the window and lose context.
- No routing → you pay the expensive model for tasks the cheap one solves.

A powerful harness (Hermes, Kando, the mature coding agents) **pays for itself in the first week**. The calculator quantifies it with your numbers.

## Data status

| Harness | Status | Note |
|---|---|---|
| Hermes Agent (Nous Research) | ✅ Audited | 22 dimensions, file:line evidence — see `docs/` |
| Kando (DevFactoryAI) | ✅ Audited | same |
| Claude Code, Codex CLI, Cursor, Cline, OpenClaw, claude-code-router, LangGraph, CrewAI | 🔶 Estimate | informed assessment, to be validated by audit |

## How to contribute

Full guide in [`CONTRIBUTING.md`](CONTRIBUTING.md) — including the **submission form for your harness** (public track with AUDITED badge, private confidential track, or estimate entry) and the audit template (`docs/audits/AUDIT-TEMPLATE.md`).

1. **Add/refine a harness**: edit the `BUILTIN_HARNESSES` array in the DATA section (top of the `<script>` in `index.html`) — each entry has 22 scores (0–10), `audited: true/false`, tags and a blurb. Open a PR.
2. **Audit a harness for real**: follow the method in `docs/` (taxonomy + scale + evidence rules) and flip `audited` to `true` with the reports.
3. **Improve the knowledge base**: the `IMPROVEMENT_PATTERNS` map (per-dimension recommendations, with the source mechanism cited) grows with every audit. Each new pattern = one PR — that's how the rankings and the advice get sharper.
4. **Improve the map or the quiz**: PRs welcome.

**The project's golden rule:** audited, preliminary and estimated data are **never** mixed without a label.

## Ranking integrity (how "for real" works)

**Fair question: can't someone tweak the weights, save, and rank first?** Answer: in their own local session, yes — and it's irrelevant, because the *official* ranking doesn't come from people's browsers. Here's how it works:

1. **The official ranking lives in the repo** — the `HARNESSES` array in `index.html`. Entries come in through a **reviewed PR**, not through a download.
2. **The AUDITED badge requires a report** — real `path:line` evidence, like the ones in `docs/`. No report, no badge.
3. **Everything you add locally stays marked LOCAL** — and any manual slider adjustment stays **visible**: a "⚠ N dimensions adjusted" counter on the badge, and the JSON export carries the provenance (`meta.heuristica` = what the analysis detected vs what you changed).
4. **The principle isn't preventing lies — it's making them visible.** Anyone opening the ranking immediately sees what is verified, what is an estimate, and what was hand-tuned.
5. **Confidentiality at the submitter's request.** Whoever submits a harness for audit may ask that it **not be revealed publicly** — the choice is the submitter's. In that case the audit is private: the report is delivered only to the submitter and the harness **does not enter the public ranking**, because the public AUDITED badge requires published evidence (no public badge with secret proof — that would be exactly the claim-without-evidence this project calls out). The private track exists as a consulting service; the public track earns the badge and the ranking spot.

**The honest path to ranking a harness:**
1. Audit the folder → Preliminary badge (analysis justifications only)
2. Adjust whatever you want → it stays flagged (visible divergence)
3. Full audit with a report → submit via PR → official Audited badge
4. The harness enters the project ranking for everyone — with the proof attached.

## Continuous improvement loop (how the Compass gets smarter)

1. **Local audit** (Preliminary badge) → first cut in minutes.
2. **Improvement plan** → the Compass points out the gaps (dimensions < 6) with proven patterns and L1–L5 maturity levels ("what's missing, what to do").
3. **Full audit** (Audited badge) → definitive scores with evidence.
4. **Recalibration** → each pair (heuristic vs audited) is compared and the heuristic's weights get sharper (validated against Hermes: mean error ~1.6/dimension).
5. **Knowledge base** → every new pattern enters `IMPROVEMENT_PATTERNS` and benefits all future harnesses.

## Method

- **Taxonomy:** 6 domains × 22 dimensions (A Core · B Guides · C Sensors · D Governance ★ · E Learning · F Operations).
- **0–10 scale per dimension (rubric v1):** 0 = doesn't exist (proven) · 2 = trace · 4 = simple case · 6 = integrated with gaps · 8 = solid with tests · 9–10 = **frontier** (formally verified invariants, learning with measured outcomes, B1–B8 behavioral proof — no current harness gets there). The HCI displays the average ×10 (0–100); future re-norming is versioned (v2), never silent — see `references/harness-map.md`.
- **Evidence:** read-only audits; every claim cites a verified `path:line`; absences proven by search; coverage declared.
- **Mandatory focus:** domain D — governance, judgment, compliance, guardrails.

## Case studies

- `docs/DEEP-HARNESS-AUDIT-HERMES.md` — line-by-line deep audit of Hermes, **published in full** (15 findings, KPIs, 15 portable patterns, 10 recommendations) — an architecture review of an open-source project, published as a courtesy and as proof of method.
- `docs/EVIDENCE-SUMMARY-KANDO.md` — Kando's **evidence summary**: the 22 dimension scores + the `path:line` mechanisms the app already cites. The full report (~190K-character comparison, 9 parallel audits) stays in the internal archive — Kando is a commercial product **in final development**; the summary publishes the evidence at exactly the level of detail the app already exposes.

## License and integrity

**License: AGPL-3.0** — the code is open, but anyone offering a derived version as a service (SaaS) must publish their source. This protects the project from forks reselling it closed.

**What's public vs retained:** the code, the taxonomy and the published audits are the proof and the magnet. The **living dataset** (new audits, aggregated telemetry, evolving scores) and the **certified audit seal** are project assets that don't fork — what gets published today determines what can be sold tomorrow.

## Internationalization (i18n)

Language selector at the top — **English is the norm**, with Portuguese, French, German, Mandarin and Hindi. The dictionary lives at the top of `index.html` (`const T = {...}`): partial translations fall back to English, and anyone can fix terms or add a language via PR. **All 6 languages are complete — 330/330 keys each** (blurbs, 22 dimensions, 64 improvement patterns, quiz, audit, method). **To add a new language:** copy the `pt:{...}` block of the dictionary, translate the values and update the `LANGUAGES` selector — `check-i18n.js` validates keys and placeholders automatically — or open a PR.

**Light/dark theme:** ☀️/🌙 button at the top — respects the system preference on first visit and remembers your choice (localStorage).

**Signature:** **@emilzo alias @eluminaime** — footer credits @emilzo (the repo name).

## Model constancy (always-current prices)

- **Live source:** the model list comes from OpenRouter on every app load — when a provider retires a model it disappears from the selector automatically; new ones show up the same day.
- **Local diff:** the app keeps a snapshot in your browser and shows what changed since your last visit ("🆕 N new · 📦 M removed since …").
- **Local history of discontinued models:** models that leave are recorded (name, date, last price) in a collapsible list — useful for pricing provenance and audit continuity.
- **Global history (public):** GitHub Actions runs `scripts/snapshot-models.mjs` daily and commits `docs/models/latest.json` + `docs/models/history.json` — the open, versioned model dataset (what the app alone can't store). Open data = asset and proof.

## i18n guarantee (mandatory norm)

`node check-i18n.js` validates (exit 1 on failure):
- [x] Keys in **EN and PT** for any new feature (other languages report fallback)
- [x] **Table-driven keys** (`dim_*`, `imp_*`, `quiz_*`, `lv_*`, `blurb_*`, `dom_*`) — the ~160 keys that reach `t()` through variables
- [x] Literal `t("key")` (double, single or template quotes) without an EN key
- [x] **Consistent `{x}` placeholders** between EN and each language (a `{N}` vs `{n}` typo fails)
- [x] Orphan keys (present in a language but not in EN) and duplicates within a block
- [x] Languages declared in `LANGUAGES` vs dictionary blocks (no language invisible to the check)
- [x] Interpolation in HTML attributes (`value`/`title`/`placeholder`/…) **without `esc()`** — at any position in the value (latent injection)
- [x] Content interpolations outside the audited allowlist (warning; zero warnings on a clean tree)

## Tests (automated + manual smoke)

**`npm test`** runs `check-i18n.js` + the **23-scenario jsdom regression suite** (`test/regression.mjs`) — quiz and audit preserved across language switches, reset/cancel without state resurrection, case-insensitive matcher, cache without poisoning, picker re-entrancy, OpenRouter widgets, home CTA, pills, theme variables in SVGs, keyboard navigation, retranslatable status, dataset enforcement (audited → published evidence). CI (`.github/workflows/ci.yml`) runs this on **every push/PR** — none of these regression classes can return without CI going red.

Recommended manual smoke before a release (Chrome, `python -m http.server 8123`):

1. **Themes:** in light and dark, badges, A–F chips, notices, pills, donut and radar all legible.
2. **Offline/CORS:** with the network cut, the Cost view shows the manual-prices notice and keeps working.
3. **Picker fallback:** on Firefox (no `showDirectoryPicker`) the audit works through the classic picker; cancelling shows "Cancelled." immediately.

Once green: `npm test` → commit.
