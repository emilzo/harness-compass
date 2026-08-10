# Harness Map — Taxonomy (6 domains × 22 dimensions)

> Canonical export of the taxonomy used by the Harness Compass. The source of truth
> is the `DOMAINS` / `DIMENSIONS` data in `index.html` (and the translated names in
> the `T` dictionary, `dim_*` keys). If this file and the code ever disagree, the
> code wins — update this export.

## A · Core & Interface

| # | Dimension | What it measures |
|---|-----------|------------------|
| A1 | Multi-model & routing | Who serves each call; fallback, failover. |
| A2 | Prompts & context | System prompt, caching, compression, context files. |
| A3 | Agent loop & orchestration | Loop, subagents, scheduling. |
| A4 | Tools & extensibility | Registry, toolsets, MCP, plugins. |

## B · Feedforward guides

| # | Dimension | What it measures |
|---|-----------|------------------|
| B1 | Intent specification | Plans, briefs, tasks. |
| B2 | Skills & playbooks | Procedural knowledge, curation. |
| B3 | Project conventions | AGENTS.md, CLAUDE.md, .cursorrules. |
| B4 | Declared policies | Explicit, testable restrictions. |

## C · Feedback sensors

| # | Dimension | What it measures |
|---|-----------|------------------|
| C1 | Tests & verification | Suites, CI, linters. |
| C2 | Evaluation (evals, LLM-as-judge) | Benchmarks, judges, drift. |
| C3 | Observability | Logs, traces, metrics, errors. |
| C4 | Self-correction | Retry, circuit breakers, fix loops. |

## D · Governance, Judgment & Guardrails ★ (mandatory focus)

| # | Dimension | What it measures |
|---|-----------|------------------|
| D1 | Security guardrails | Anti-injection, scanning, validation. |
| D2 | Permissions & sandboxing | Approvals, least privilege, sandbox. |
| D3 | Judgment & escalation | Decides alone vs human; thresholds. |
| D4 | Compliance & legal | Audit, retention, GDPR. |
| D5 | Ethics & alignment | Disclosure, fairness, limitations. |

## E · Lifecycle & learning

| # | Dimension | What it measures |
|---|-----------|------------------|
| E1 | Memory & learning | Persistence, anti-promptware. |
| E2 | Human steering loop | How the human iterates on the harness. |

## F · Operations

| # | Dimension | What it measures |
|---|-----------|------------------|
| F1 | Execution & environments | Where it runs: local, docker, cloud. |
| F2 | Cost & efficiency | Cap, budgets, rate limiting. |
| F3 | Resilience | Failover, timeouts, crash recovery. |

## Maturity scale (0–10)

| Score | Meaning |
|-------|---------|
| 0 | Does not exist (proven by search) |
| 2 | Trace / stub not wired to the execution path |
| 4 | Works in the simple case, degrades predictably |
| 6 | Functional and integrated, known gaps |
| 8 | Solid, errors handled, tests |
| 10 | Reason for existing, depth beyond the requirement |

**HCI (Harness Compass Index)** = plain average of the 22 dimension scores,
**displayed 0–100** (average × 10). Dimensions are scored 0–10 on the maturity
rubric above. This is **rubric v1**.

## Frontier anchors (why nobody is at 100 — by design)

The 9–10 band of every dimension is reserved for **frontier criteria that no
harness meets today** (2026 baseline: the best audited dimension scores are 9;
the best HCI is 75/100). A 10 requires evidence such as:

- invariants and guardrails **formally verified**, not just tested;
- cross-session learning with **measured** outcome improvement (not just memory);
- behavioral proof: passing the B1–B8 benchmark scenarios at published thresholds;
- cost optimality demonstrated against a baseline, not just capped.

The ceiling is mathematically reachable and empirically unreached — that is the
headroom for where the field is going. Scores are expected to compress upward as
practices mature; when today's differentiators become table stakes, the rubric is
**re-normed as v2** with raised anchors and re-audited entries. Rankings always
display the rubric version — a 75 on v1 is not comparable to a 75 on v2, and the
version tag is what keeps historical honesty. The long-term difficulty curve
lives in the behavioral benchmark (B1–B8), whose scenarios are versioned and
hardened over time.

**Evidence rule:** audits are read-only; every claim cites a verified `path:line`;
absences are proven by search; coverage is declared. Audited / preliminary /
estimate are never mixed without a label.
