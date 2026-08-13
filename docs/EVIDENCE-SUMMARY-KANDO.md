# Evidence Summary — Kando (PUBLIC ESTIMATE)

> **Public status: ESTIMATE.** Kando is a commercial product by DevFactoryAI,
> currently preparing for go-to-market. It was audited internally, but the full report
> (part of a ~190K-character, 9-parallel-audit comparison against Hermes Agent,
> performed 2026-08-09 under the same read-only, `path:line` evidence rules as the
> [published Hermes audit](DEEP-HARNESS-AUDIT-HERMES.en.md)) is retained internally.
> The public **AUDITED** badge is reserved for reports whose line-by-line evidence
> readers can inspect for themselves. This summary explains what informed Kando's
> scores, but it does not qualify Kando for that badge while the source and full
> report remain private.

## Scores (22 dimensions, 0–10)

| A1 | A2 | A3 | A4 | B1 | B2 | B3 | B4 | C1 | C2 | C3 | C4 | D1 | D2 | D3 | D4 | D5 | E1 | E2 | F1 | F2 | F3 |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 7 | 5 | 6 | 2 | 8 | 2 | 8 | 7 | 7 | 7 | 7 | 7 | 5 | 6 | 7 | 6 | 4 | 6 | 6 | 6 | 8 | 8 |

**HCI (composite): 61/100** (rubric v1; dimensions scored 0–10). Domain profile: strong in feedforward specification
(B1/B3), evaluation (C2), cost control (F2) and resilience (F3); weak in native
tooling (A4) and skills (B2) — by design, Kando supervises *external* agents
(Codex/Claude/OpenClaw) rather than shipping its own toolset.

## Key evidence (mechanism → source)

**Evaluation & verification (C2 — the differentiator)**
- 3-layer LLM-as-judge: deterministic checks → N parallel specialists →
  fresh-eyes validator, fail-closed — `ai_review_service.py:1-25`
- Empirical verification: runs the project's real checks to green, with model
  escalation on retry — `outcome_verification_service.py:504-617`

**Cost as control (F2)**
- Hard monetary cap per run, fail-closed — `KANDO_LLM_COST_CAP_EUR` +
  append-only per-call ledger — `migrations/027`
- Rate limiting with active skip of rate-limited providers in fallback —
  `agent_llm_client.py:1286-1295`

**Intent specification (B1)**
- Persisted task → run → phases with the model pinned per phase —
  `task_orchestration_service.py:50,323-379`
- Canonical roadmap with states and validation dates+SHA — `docs/MASTER-ROADMAP.md`

**Routing (A1)**
- Utility-scored model selection (quality − λ·cost − μ·latency) —
  `scored-selection.ts:107-150`

**Conventions & policies (B3/B4)**
- Multi-client guide hierarchy (AGENTS.md source; CLAUDE.md/GEMINI.md pointers
  that do not redefine); declared conflict rule "code wins" — `README.md:73`
- Chaos tests that test invariants by name (every rule verifiable)

**Self-correction (C4)**
- Dedicated circuit breaker closed/open/half_open with injectable clock —
  `llm_circuit_breaker.py:23-161`
- Retry with transient/permanent classification — `llm_retry.py`
- Fix loop with model escalation for code self-correction — `iterative_fixer_service.py`

**Compliance (D4)**
- Per-request audit trail with redaction + stats — `audit_log.py` + `routes/audit.py`
- Hash-only telemetry (never raw content, only `prompt_hash`) — `outcomes.ts:3-14`

**Resilience (F3)**
- Leases/fencing for multi-instance and anti-duplication — `path_leases.py:13-54`

## Known weaknesses (as publicly stated in the ranking)

Lack of destructive-command containment and of a native toolset (A4: 2); no
skills/playbook system (B2: 2); security guardrails and sandboxing below the
Hermes bar (D1/D2). These are the flip side of the supervisory design — the
audit's central lesson, published in the app's method view: **one harness's
strengths are the other's weaknesses; the cross-port is the way.**

## Method & coverage

The internal review used the same taxonomy and evidence rules as the Hermes audit
([references/harness-map.md](../references/harness-map.md)): read-only analysis,
every claim cites a verified `path:line`, absences proven by search, coverage
declared. The references below are retained for internal traceability, but public
readers cannot independently check them against a public repository. For that
reason Kando remains an **Estimate** until a line-by-line report can be published.
