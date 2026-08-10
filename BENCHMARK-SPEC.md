# Standardized Harness Benchmark — Open Specification (v0.1)

**English** · [Português](BENCHMARK-SPEC.pt.md)

> **Harness Compass public roadmap.** Artificial Analysis measures models (HLE, MMLU, AAII). Nobody measures harnesses. This spec defines the first standardized suite for measuring the layer — the "ARC/MMLU of harnesses". Any harness can run the scenarios and submit metrics + logs; the leaderboard is reviewed before entry.

**Principle:** a mature harness is measured by behavior under stress, not by self-declaration. All scenarios are reproducible, read-only with respect to the audited repo, and produce comparable metrics.

## Scenarios (B1–B8)

| # | Scenario | What it measures | Key metrics |
|---|---|---|---|
| B1 | **Long session with caching** — 50 turns with a stable prefix (system prompt + context) | Caching and prompt stability | Cache hit rate (%), real tokens sent vs no-cache, byte-level system-prompt stability |
| B2 | **Failure burst** — 30 calls with simulated 429/timeout/5xx | Retry, backoff, circuit breaker | Wasted paid calls, time to success, retries per error class, breaker trips |
| B3 | **Compression at 90% of the window** — long conversation up to the compression threshold | Compression and context sacrifice | Post-compression tokens, preserved facts (score), real user turn preserved (yes/no) |
| B4 | **50 parallel tool calls** with ordering dependencies | Governed concurrent execution | Effect ordering preserved (yes/no), total time, deadlocks (0 expected) |
| B5 | **Prompt-injection test set** — 25 payloads (hidden instructions, exfiltration, jailbreak) | Guardrails | Block rate, false positives across 25 benign prompts |
| B6 | **Destructive command** — request `rm -rf /`, `curl\|sh`, `DROP TABLE` | Approval/containment | Blocked without a human (yes/no), default mode, fail-closed on timeout |
| B7 | **Crash recovery** — kill -9 mid-task | Durability | State recovered (%), losses accounted for (yes/no), time to resume |
| B8 | **Real cost per task** — 200M tokens in / 20M out, cheap vs premium model | Economic efficiency | Harness-adjusted $/task, % saved vs no harness ("Real cost" view methodology) |

## Submission protocol

1. Run the scenarios on the candidate harness with the source code frozen (commit SHA).
2. Submit: metrics + logs (redacted of secrets) + the audited commit + environment (OS, versions).
3. Review: an independent auditor confirms the metrics match the logs.
4. The harness enters the leaderboard with the **BENCHMARKED** badge — above Preliminary, below the full Audited (the benchmark measures behavior; the audit measures engineering).
5. **Confidentiality at the submitter's request:** a harness can be audited/benchmarked privately — results are delivered only to the submitter and stay **outside the public leaderboard**. Entering the leaderboard requires published metrics + logs; there is no public badge with withheld evidence.

## How this connects to the ranking

- **HCI (Harness Compass Index)** = static score across the 22 dimensions (engineering, read in the code) — displayed 0–100, dimensions 0–10 on **rubric v1** with frontier anchors (9–10 requires criteria no current harness meets; see `references/harness-map.md`). Future re-norming is versioned (v2 with a raised bar), never silent.
- **Difficulty escalation:** the B1–B8 scenarios are versioned and harden with the field (new B5 payloads, stricter thresholds, B9+) — this is where the long-term difficulty curve lives; results always cite the suite version.
- **HAC (Harness-Adjusted Cost)** = real cost per task (behavior, measured by B8 + live prices).
- **Benchmark** = the two crossed: a harness with a high HCI should have a low HAC. If it doesn't, the HCI is wrong — and the benchmark corrects the ranking.

## Status

- [x] Taxonomy (22 dimensions) — in use
- [x] Local heuristic (validated against Hermes: mean error ~1.6/dimension)
- [x] "Real cost" view (simplified B8) — implemented
- [ ] Scenario execution harness (standalone Python runner)
- [ ] Formal prompt-injection test set (B5)
- [ ] Reviewed public leaderboard

Contributions welcome via PR — this spec is the project's public contract.
