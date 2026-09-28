# 🧭 Harness Compass

**English** · [Português](README.pt.md)

**Live: https://emilzo.github.io/harness-compass/**

**Research Preview v0.1**

**An evidence-based architecture maturity scorecard for AI agent harnesses.** The harness is everything that isn't the model: guides, loop, tools, permissions, sandbox, verification, observability, cost. The scorecard compares architecture maturity. The planned B1–B8 behaviour benchmark stays separate and is not implemented. Performance benchmarks of agent scaffolds already exist, including [Terminal-Bench](https://www.tbench.ai/leaderboard), the [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai/agents/coding-agents), and [HAL](https://hal.cs.princeton.edu/).

> "Loops coordinate. Harnesses guide, execute, verify and decide. Models generate."

## What it is

A single-page web app (zero runtime dependencies, zero build, jsdom exists only as a devDependency of the test suite) with 8 views:

1. **Paradigm**: why the harness decides how much of your token money is wasted.
2. **Ranking**: harnesses scored across **22 dimensions** with the **HCI (Harness Compass Index) 0–100** (dimensions scored 0–10 on maturity rubric **v1**). A score of 10 is still unmet: formal verification, learning with measured outcomes, a reviewed B1–B8 run, or cost optimality against a baseline. Scores of 9 exist. Hermes Agent has 9s in A2, C1 and F3. T3 Code has 9s in C1 and C3. The best current HCI is 75. The default list shows audited entries only. Estimate entries are behind a control, have no rank position, and carry a note on how they were assigned. Radar fingerprint and donut; sortable, filterable by domain and by provenance. HCI is an architecture maturity scorecard. It is not a task-performance benchmark. AUDITED / PRELIMINARY / ESTIMATE / LOCAL are always kept separate.
3. **Modelled cost (illustrative)**: one assumed monthly token workload, shown as two results. (a) Premium model only: cache, compression and avoided-failure assumptions, no routing. (b) With routing to the economy model, labelled as such. Units are dollars per month. This is not a measurement and not a cost per task. Measured cost per task is planned in the B8 scenario runner and is not implemented. Default volumes and prices are assumptions. See [Cost model assumptions](#cost-model-assumptions).
4. **Harness Map**: the full taxonomy (6 domains × 22 dimensions).
5. **📂 Audit a local repo**: open a repo folder; heuristic analysis of the 22 dimensions with justifications, adjustable sliders (adjustments stay flagged, integrity), improvement plan, add-to-ranking and JSON export. Your code stays in the browser and is not uploaded.
6. **Decision quiz**: 6 questions weight the dimensions by your profile and recommend the top 3 with justification.
7. **Calculator**: the same assumed monthly workload, with separate results for the premium model only and for routing to the economy model. Slider defaults are assumptions.
8. **Method & evidence**: maturity scale, integrity, how the local audit works, case studies.

The open behavioural benchmark spec (B1–B8 scenarios, submission protocol and a future reviewed leaderboard) lives in `BENCHMARK-SPEC.md`. It is separate from the HCI architecture score.

## Compatibility

| Feature | Chrome / Edge | Firefox | Safari | Note |
|---|---|---|---|---|
| Ranking, map, quiz, calculator, charts | ✅ | ✅ | ✅ | Standard HTML/CSS/JS, zero dependencies |
| Folder audit (modern picker) | ✅ | — | — | Requires HTTPS (GitHub Pages) or localhost |
| Folder audit (classic fallback) | ✅ | ✅ | ⚠️ partial | Safari does not reliably return folder hierarchies |
| `file://` (double-click) | ✅ (fallback) | ✅ | ✅ | The modern picker falls back to the classic one automatically |

**Mac, Windows, Linux:** identical behavior. The APIs depend on the browser, not the OS. For the best folder-audit experience: **Chrome or Edge on the GitHub Pages deployment** (HTTPS).

## How to use

```bash
# 0. Or just open the live app: https://emilzo.github.io/harness-compass/

# 1. Open in any browser (double-click works, it's a single file):
open index.html        # macOS / Linux
start index.html       # Windows

# 2. Or publish to GitHub Pages: push the repo → Settings → Pages → main branch
```

## The paradigm (the thesis)

The price of an LLM is not the model's price. It's the model's price **times the harness's waste**:

- No byte-stable caching → you pay for the same prefix over and over.
- No smart retry/fallback → transient failures become dead calls and dev time.
- No compression → long conversations blow the window and lose context.
- No routing → every call uses the premium price in this model.

This project does not claim that a strong harness makes a cheaper model match a more expensive one. The links above are task benchmarks of agent scaffolds. They are not evidence for that claim.

## Data status

| Harness | Status | Note |
|---|---|---|
| Hermes Agent (Nous Research) | ✅ Audited | 22 dimensions, file:line evidence. see `docs/` |
| Kando (DevFactoryAI) | Author's own product, not ranked | Built by the author of Harness Compass (Emílio, @emilzo / DevFactoryAI). See CLA.md. Estimate scores. The line-by-line report is private. Not in the ranking until a public audit exists. |
| Claude Code, Codex CLI, Cursor, Cline, OpenClaw, claude-code-router, LangGraph, CrewAI | 🔶 Estimate | informed assessment, to be validated by audit |

## How to read the results

- **HCI**: architectural maturity from code and evidence across 22 dimensions. It is not a task-performance benchmark.
- **Audited**: a human code audit with published `path:line` evidence.
- **Preliminary**: the browser-only heuristic scan; useful as a first cut, not a full audit.
- **Estimate**: an informed assessment without a published, independently checkable audit report.
- **Local**: added in your own browser session. It does not become part of the project dataset.
- **Benchmarked**: reserved for a published, reviewed B1–B8 behavioural run. It is separate from the HCI provenance labels above.

## How to contribute

Full guide in [`CONTRIBUTING.md`](CONTRIBUTING.md) including the **public submission form for your harness** (public track with AUDITED badge or estimate entry), the [private contact email](mailto:emilio.mina@gmail.com?subject=Private%20Harness%20Compass%20audit), [LinkedIn](https://www.linkedin.com/in/emiliomina/) for business contact, and the audit template (`docs/audits/AUDIT-TEMPLATE.md`).

1. **Add/refine a harness**: edit the `BUILTIN_HARNESSES` array in the DATA section (top of the `<script>` in `index.html`), each entry has 22 scores (0–10), `audited: true/false`, tags and a blurb. Open a PR.
2. **Audit a harness for real**: follow the method in `docs/` (taxonomy + scale + evidence rules) and flip `audited` to `true` with the reports.
3. **Improve the knowledge base**: the `IMPROVEMENT_PATTERNS` map (per-dimension recommendations, with the source mechanism cited) grows with every audit. Each new pattern = one PR. That's how the rankings and the advice get sharper.
4. **Improve the map or the quiz**: PRs welcome.

**The project's golden rule:** audited, preliminary and estimated data are **never** mixed without a label.

An internal or private audit can inform an **Estimate**, but it does not earn the public **AUDITED** badge. That badge requires published, line-by-line evidence that readers can check for themselves.

## Ranking integrity (how "for real" works)

**Fair question: can't someone tweak the weights, save, and rank first?** Answer: in their own local session, yes and it's irrelevant, because the *official* ranking doesn't come from people's browsers. Here's how it works:

1. **The official ranking lives in the repo**: the `HARNESSES` array in `index.html`. Entries come in through a **reviewed PR**, not through a download.
2. **The AUDITED badge requires a report**: real `path:line` evidence, like the ones in `docs/`. No report, no badge.
3. **Everything you add locally stays marked LOCAL**: and any manual slider adjustment stays **visible**: a "⚠ N dimensions adjusted" counter on the badge, and the JSON export carries the provenance (`meta.heuristica` = what the analysis detected vs what you changed).
4. **The principle isn't preventing lies.
5.
6.
7.
8.
9.
10.
11. It's making them visible.** Anyone opening the ranking immediately sees what is verified, what is an estimate, and what was hand-tuned.
12. **Confidentiality at the submitter's request.** Whoever submits a harness for audit may ask that it **not be revealed publicly** the choice is the submitter's. In that case the audit is private: the report is delivered only to the submitter and the harness **does not enter the public ranking**, because the public AUDITED badge requires published evidence (no public badge with secret proof that would be exactly the claim-without-evidence this project calls out). The private track exists as a consulting service and starts by [email](mailto:emilio.mina@gmail.com?subject=Private%20Harness%20Compass%20audit), never in a public issue. Do not send private code until a safe transfer method has been agreed. The public track earns the badge and the ranking spot.

**The honest path to ranking a harness:**
1. Audit the folder → Preliminary badge (analysis justifications only)
2. Adjust whatever you want → it stays flagged (visible divergence)
3. Full audit with a report → submit via PR → official Audited badge
4. The harness enters the project ranking for everyone with the proof attached.

## Continuous improvement loop (how the Compass gets smarter)

1. **Local audit** (Preliminary badge) → first cut in minutes.
2. **Improvement plan** → the Compass points out the gaps (dimensions < 6) with proven patterns and L1–L5 maturity levels ("what's missing, what to do").
3. **Full audit** (Audited badge) → definitive scores with evidence.
4. **Recalibration** → each pair (heuristic vs audited) can be compared. A previous note claimed a mean error of about 1.6 per dimension against Hermes. That figure has no public source and is removed. The heuristic is not calibrated against a published error table.
5. **Knowledge base** → every new pattern enters `IMPROVEMENT_PATTERNS` and benefits all future harnesses.

## Method

- **Taxonomy:** 6 domains × 22 dimensions (A Core · B Guides · C Sensors · D Governance ★ · E Learning · F Operations).
- **0–10 scale per dimension (rubric v1):** 0 = doesn't exist (proven) · 2 = trace · 4 = simple case · 6 = integrated with gaps · 8 = solid with tests · 9 = high, and in use (Hermes Agent A2, C1, F3; T3 Code C1, C3) · 10 = unmet frontier (formally verified invariants, learning with measured outcomes, a reviewed B1–B8 run, cost optimality against a baseline). The HCI displays the average ×10 (0–100). The best current HCI is 75. Future re-norming is versioned (v2), never silent. See `references/harness-map.md`.
- **Evidence:** read-only audits; every claim cites a verified `path:line`; absences proven by search; coverage declared.
- **Mandatory focus:** domain D, governance, judgment, compliance, guardrails.

## Case studies

- `docs/DEEP-HARNESS-AUDIT-HERMES.en.md` line-by-line deep audit of Hermes, **published in full in English** (15 findings, KPIs, 15 portable patterns, 10 recommendations), an architecture review of an open-source project, published as a courtesy and as proof of method. The [Portuguese original](docs/DEEP-HARNESS-AUDIT-HERMES.md) remains available.
- `docs/EVIDENCE-SUMMARY-KANDO.md` public summary of a private review. Kando is built by the author of Harness Compass (DevFactoryAI). It is not ranked. Every `path:line` in that summary is unverifiable (private source).

## Disclosure

Kando is built by the author of Harness Compass (Emílio, @emilzo / DevFactoryAI). See `CLA.md`. It is not in the ranking until a public audit exists. Improvement-plan patterns that cite Kando files are marked unverifiable (private source).

## Cost model assumptions

The coefficients 0.7 (cache), 0.5 (avoided failures), 0.45 (compression) and 0.65 (routing) have no published measurement. They are assumptions. Cache is applied after compression. Compression reduces the volume sent. Cache then splits that volume into cached reads and uncached input. The two rates are treated as independent. That is also an assumption. Cached reads cost 0.1 times the input price, the factor Anthropic publishes for prompt-cache reads (https://platform.claude.com/docs/en/build-with-claude/prompt-caching). It is not a measured bill for these harnesses. Cache-write premiums are not modelled. Default volumes: 200 million input tokens and 20 million output tokens per month. Default prices: $0.14 and $0.42 (economy) and $3 and $15 (premium) per million tokens. The models are not named and the prices are not dated. Calculator controls start at 55/25/30/70. Those are assumptions too. Routing is `0.65 × A1/10`. A score of 0 routes nothing. The `min()` caps in `harnessEff` are unchanged (0.85, 0.60, 0.60, 0.95) and are not reached by the current coefficients. Reachable rates are cache up to 70%, avoided failures up to 50%, compression up to 45%, routing from 0% to 65%. Measured cost per task is planned in the B8 scenario runner and is not implemented.

## License and integrity

**License: AGPL-3.0** the code is open, but anyone offering a derived version as a service (SaaS) must publish their source. This protects the project from forks reselling it closed.

**What's public vs retained:** the code, the taxonomy and the published audits are the proof and the magnet. The **living dataset** (new audits, aggregated telemetry, evolving scores) and the **certified audit seal** are project assets that don't fork what gets published today determines what can be sold tomorrow.

## Internationalization (i18n)

Language selector at the top. **English is the norm**, with Portuguese, French, German, Mandarin and Hindi. The dictionary lives at the top of `index.html` (`const T = {...}`). A missing label in another language falls back to English. An earlier claim that all six languages were complete at 330 keys was wrong. Do not freeze a key count here. Run `node check-i18n.js`. **To add a new language:** copy the `pt:{...}` block, translate the values and update the `LANGUAGES` selector.

**Light/dark theme:** ☀️/🌙 button at the top — respects the system preference on first visit and remembers your choice (localStorage).

## Model constancy (always-current prices)

- **Live source:** the model list comes from OpenRouter on every app load — when a provider retires a model it disappears from the selector automatically; new ones show up the same day.
- **Local diff:** the app keeps a snapshot in your browser and shows what changed since your last visit ("🆕 N new · 📦 M removed since …").
- **Local history of discontinued models:** models that leave are recorded (name, date, last price) in a collapsible list — useful for pricing provenance and audit continuity.
- **Committed snapshot:** `docs/models/latest.json` in git is still the file committed on 2026-08-09 (378 models). `.github/workflows/models-snapshot.yml` runs daily and executes `scripts/snapshot-models.mjs`. When `docs/models/latest.json` or `docs/models/history.json` changes, it opens or updates a pull request from branch `models-snapshot` into `main`. It does not push to `main`. The schedule uses the workflow file on `main`, so this starts after this branch is merged. After a create or update, the same workflow runs `gh workflow run ci.yml --ref models-snapshot` with the default `GITHUB_TOKEN`. That needs `actions: write`, and `workflow_dispatch` on `ci.yml` must be on `main` before the command can start a run. The job name stays `test`. GitHub docs say a `workflow_dispatch` check does not appear on the pull request and does not satisfy a required status check in a branch ruleset. The events that do count are `push`, `pull_request`, `pull_request_review`, `pull_request_target`, `deployment`, and `deployment_status`. The `pull_request` run created by the default token still waits until a person with write access approves it. Auto-merge is not enabled, so that pull request is merged by hand. The page still loads the live OpenRouter list in the browser.

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

**`npm test`** runs `check-i18n.js` + the jsdom regression suite (`test/regression.mjs`). It covers quiz and audit state across language switches, reset/cancel, the matcher, cache, picker re-entrancy, OpenRouter widgets, the home CTA, contact channels, pills, theme variables in SVGs, keyboard navigation, dataset enforcement (audited → published evidence), the modelled-cost formula, and the audited-only default ranking. CI (`.github/workflows/ci.yml`) runs this on **every push/PR**.

Recommended manual smoke before a release (Chrome, `python -m http.server 8123`):

1. **Themes:** in light and dark, badges, A–F chips, notices, pills, donut and radar all legible.
2. **Offline/CORS:** with the network cut, the Cost view shows the manual-prices notice and keeps working.
3. **Picker fallback:** on Firefox (no `showDirectoryPicker`) the audit works through the classic picker; cancelling shows "Cancelled." immediately.

Once green: `npm test` → commit.
