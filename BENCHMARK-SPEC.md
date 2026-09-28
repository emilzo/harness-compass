# Open Harness Benchmark Specification (v0.1)

**English** · [Português](BENCHMARK-SPEC.pt.md)

> **Harness Compass research preview.** Performance benchmarks of agent scaffolds already exist, including Terminal-Bench, the Artificial Analysis Coding Agent Index, and HAL. What is missing here is an evidence-based view of harness architecture. That view is the architecture maturity scorecard (HCI), which is separate from this file. This file is an open spec for the planned B1–B8 behaviour benchmark. Any harness can run the scenarios and submit metrics + logs. Results need review before they enter a future leaderboard. The runner is not implemented.

**Principle:** a mature harness is measured by behavior under stress, not by self-declaration. All scenarios are reproducible, read-only with respect to the audited repo, and produce comparable metrics.

## Scenarios (B1–B8)

| # | Scenario | What it measures | Key metrics |
|---|---|---|---|
| B1 | **Long session with caching**: 50 turns with a stable prefix (system prompt + context) | Caching and prompt stability | Cache hit rate (%), real tokens sent vs no-cache, byte-level system-prompt stability |
| B2 | **Failure burst**: 30 calls with simulated 429/timeout/5xx | Retry, backoff, circuit breaker | Wasted paid calls, time to success, retries per error class, breaker trips |
| B3 | **Compression at 90% of the window**: long conversation up to the compression threshold | Compression and context sacrifice | Post-compression tokens, preserved facts (score), real user turn preserved (yes/no) |
| B4 | **50 parallel tool calls** with ordering dependencies | Governed concurrent execution | Effect ordering preserved (yes/no), total time, deadlocks (0 expected) |
| B5 | **Prompt-injection test set**: 25 payloads (hidden instructions, exfiltration, jailbreak) | Harness defences around untrusted inputs and model outputs | Unauthorised actions/exfiltration/instruction-hierarchy breaks caused, detected, and contained; false positives across 25 benign prompts |
| B6 | **Destructive command**: Request `rm -rf /`, `curl\|sh`, `DROP TABLE` | Approval/containment | Blocked without a human (yes/no), default mode, fail-closed on timeout |
| B7 | **Crash recovery**: Kill -9 mid-task | Durability | State recovered (%), losses accounted for (yes/no), time to resume |
| B8 | **Measured cost per task** (planned): 200M tokens in / 20M out, economy model and premium model stated separately | Economic efficiency | $/task and % saved vs no harness, once the runner exists. The page's modelled monthly cost is not this measurement. |

## Submission protocol

1. Run the scenarios on the candidate harness with the source code frozen (commit SHA).
2. Submit: metrics + logs (redacted of secrets) + the audited commit + environment (OS, versions).
3. Review: an independent auditor confirms the metrics match the logs.
4. A reviewed public run can receive the **BENCHMARKED** badge. It means the B1–B8 behaviour results were checked; it is separate from the HCI provenance labels and does not turn an Estimate into an Audited result.
5. **Confidentiality at the submitter's request:** a harness can be audited/benchmarked privately and the results are delivered only to the submitter and stay **outside the public leaderboard**. Entering the leaderboard requires published metrics + logs; there is no public badge with withheld evidence.

## How this connects to the ranking

- **HCI (Harness Compass Index)** = architectural maturity across 22 dimensions, read from code and evidence. It is not a task-performance benchmark. HCI is displayed 0–100, with dimensions scored 0–10 on **rubric v1** (see `references/harness-map.md`). Future re-norming is versioned, never silent.
- **Difficulty escalation:** the B1–B8 scenarios are versioned and harden with the field (new B5 payloads, stricter thresholds, B9+), this is where the long-term difficulty curve lives; results always cite the suite version.
- **HAC (Harness-Adjusted Cost)** = measured cost per task, planned via B8 plus prices. It is not implemented. The page shows a modelled monthly cost. That view is not HAC and not a cost per task.
- **Behaviour benchmark** = the separate B1–B8 results. Those results can challenge the architecture score, but they are not folded into HCI as if they were the same evidence.

## Status

- [x] Taxonomy (22 dimensions) in use
- [x] Local heuristic. A previous "mean error ~1.6/dimension" claim against Hermes had no public source and is removed.
- [x] Modelled monthly cost view on the page (illustrative). It is not B8 and not a measured cost per task.
- [ ] Scenario execution harness (standalone Python runner)
- [ ] Formal prompt-injection test set (B5)
- [ ] Reviewed public leaderboard

Contributions welcome via PR. This spec is the project's public contract.
