# Contributing to Harness Compass

Thanks for wanting in. There are four ways to contribute, from 2 minutes to a full audit.

## 1 · Submit your harness (the one you came for)

Audit your own repo in the app (**📂 Audit a folder** — 100% local, nothing leaves
your machine), click **⬇ Export JSON**, then use the right channel:

- **Public audit or Estimate:** [open a public submission issue](../../issues/new?template=submit-harness.yml)
  with the JSON attached.
- **Private audit:** email [emilio.mina@gmail.com](mailto:emilio.mina@gmail.com?subject=Private%20Harness%20Compass%20audit)
  first. Do not put private code or confidential details in a GitHub issue. We
  will agree on a safe transfer method before any material is sent.

| Track | What happens | What you get |
|-------|--------------|--------------|
| **Public audit** | We audit the code against the [22-dimension taxonomy](references/harness-map.md) with `path:line` evidence; the report is published in `docs/audits/` | **AUDITED** badge + official ranking entry |
| **Private audit** | Same audit, report delivered only to you, nothing published | Private report; **no public listing** (the public badge requires published evidence — no exceptions) |
| **Estimate entry** | You open a PR adding the harness with `audited:false` and a justified score set | **ESTIMATE** badge in the ranking, flagged for future audit |

Public audits are free and queued in submission order; private audits are a consulting
service. The confidentiality choice is **yours**, but private work always starts
by email rather than through a public issue.

**Curation note:** the official ranking is a curated benchmark, not a directory.
Priority (and inclusion) favors harnesses with real-world usage, an identifiable
vendor/maintainer and an active project. Duplicates of an already-listed harness
are closed; experiments and personal forks are exactly what the **local audit**
in the app is for — private, instant, and yours.

## 2 · Add or fix an estimate entry (PR)

Edit `BUILTIN_HARNESSES` in the DATA section at the top of the `<script>` in
`index.html`: 22 scores (0–10), `audited:false`, tags, a blurb key with EN+PT
translations. Justify the scores in the PR description. `npm test` must stay green.

## 3 · Write or review an audit

Use [`docs/audits/AUDIT-TEMPLATE.md`](docs/audits/AUDIT-TEMPLATE.md). The evidence
rules are non-negotiable: read-only analysis, every claim cites a verified
`path:line`, absences proven by search, coverage declared, unread areas listed.
An entry only ships `audited:true` when the `evidence` field points to a report
in this repo — the test suite enforces it.

## 4 · Translations and fixes

Six languages live in the `T` dictionary in `index.html` (`node check-i18n.js`
validates keys and placeholders — EN and PT are mandatory for new features).
Bug fixes: the jsdom regression suite (`npm test`) must stay green; add a test
when you fix a behavior.

## Ground rules

- Integrity first: AUDITED / PRELIMINARY / ESTIMATE / LOCAL are never mixed
  without a label, and manual adjustments stay visible. Don't submit PRs that
  blur those lines — they will be declined regardless of code quality.
- One PR, one concern. `npm test` green before review.
- **Contributor License Agreement:** by submitting a contribution you accept the
  [CLA](CLA.md) — you keep your copyright and grant the project steward a broad
  license (including relicensing) so the free, AGPL public benchmark can be
  funded by commercial tooling built on the same codebase. The PR template asks
  you to confirm it.
