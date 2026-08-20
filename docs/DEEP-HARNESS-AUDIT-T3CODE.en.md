> **Published evidence — Harness Compass AUDITED badge.** This is the full audit
> report behind the T3 Code entry in the [Harness Compass](../index.html)
> ranking. Read-only audit, performed 2026-08-20 against a local checkout of the
> public [pingdotgg/t3code](https://github.com/pingdotgg/t3code) repository at
> commit `9027d6267`. Every `file:line` citation was read this session; absences
> are proven by search (commands shown). Published as a courtesy-first
> architecture review of open-source software: the weaknesses discussed are
> design absences and policy gaps, not exploitable vulnerabilities.

# DEEP HARNESS AUDIT — T3 Code (line by line)

**Date:** 2026-08-20 · **Mode:** read-only (read_file / grep / find; nothing executed or changed)
**Target:** `pingdotgg/t3code` @ `9027d6267` (pnpm monorepo, TypeScript on Effect-TS, ~13.8K source files)
**Method:** `harness-map.md` taxonomy v1 · 5 parallel deep dives (core loop & providers · feedforward guides · feedback sensors · governance D1–D5 · lifecycle & operational) · single consolidation · `path:line` evidence verified by reading.

---

## 0. Executive summary

T3 Code is a **control surface, not a policy engine**. It is a Node WebSocket server that wraps five provider CLIs (Codex, Claude Code, Cursor, Grok Build, OpenCode) and serves web, desktop and mobile clients over a single authenticated Effect RPC connection. Its structural obsessions are declared in its own `AGENTS.md` — *open at the core, performance without compromise, remote-ready, multi-surface* — and they are real in the code: the server is one execution boundary, orchestration is **event-sourced** (client command → pure `decider` → persisted events → `projector`), every turn is bracketed by **hidden Git-ref checkpoints**, and every RPC method carries a **type-enforced capability scope** (adding an unscoped method is a compile error). This is genuinely sophisticated engineering, far from the "slop" its own author uses as a pejorative (`AGENTS.md:17`).

**Where it is mature (7–9/10):** the client↔server capability boundary (D2 — the best governance pattern in the codebase), event-sourced orchestration with idempotent receipts (A3), tests & verification (C1 — 855 test files, 4 CI jobs, a custom oxlint plugin), observability (C3 — Effect metrics, OTLP, a Rust telemetry sidecar), resilience (F3 — checkpoint restore, staged + rollback-capable server updates), and the feedforward guides (B3/B4 — a genuinely repo-specific AGENTS.md plus one "never" rule that is *machine-enforced and tested*).

**Where it is fragile (1–4/10):** **no prompt-injection defense and no T3-side command scanning** (D1 — the agent's shell commands run unscrutinized inside the provider CLI), **no evals / LLM-as-judge** (C2), **no data-governance** (D4 — telemetry on by default with a hardcoded key, no consent, retention, export or deletion), **no ethics/AI disclosure** (D5), **no learning** (E1 — event-sourced but not self-learning), and **"Full access" as the default permission mode** (the weak half of D2).

The single most important fact for reading these scores: T3 Code **owns the client↔server boundary** (which it governs excellently) and **delegates the agent↔system boundary** — which commands the agent may run, which files it may write — to the provider CLI's own sandbox, enforced *only when that provider implements one*. This split is deliberate and documented, and it is simultaneously the source of its best score (D2) and its worst (D1).

**Composite score by domain:** A 5.8 · B 7.0 · C 6.5 · D 4.2 · E 4.5 · F 7.3 — **average ~5.9/10 (HCI 59/100)**.

---

## 1. Declared coverage

| Area / file | Reading | % |
|---|---|---|
| `apps/server/src/provider/**` (builtInDrivers, builtInProviderCatalog, ProviderInstanceRegistryLive, ProviderService, CodexDeveloperInstructions, ClaudeSkills, Codex/Claude adapter regions) | full/mostly full + grep | ~75% |
| `apps/server/src/orchestration/**` (OrchestrationEngine, decider, projector, ProviderCommandReactor 1–500/1442, ProviderRuntimeIngestion 1–500/2088, CheckpointReactor 1–500/946) | full engine + windows | ~60% |
| `apps/server/src/mcp/**` (McpHttpServer, preview toolkits), `packages/effect-acp/src/client.ts` 1–500/585 | full/mostly | ~60% |
| Guides: AGENTS.md, CLAUDE.md, CONTRIBUTING.md, README.md, `.cursor/rules/cursor-cloud.mdc`, `docs/internals/glossary.md`, `.plans/` (README + 2 of 31), `.agents/skills/*/SKILL.md` (all 4), `.github/triage/PLAYBOOK.md`, `.macroscope/check-run-agents/*` | full | ~85% |
| `apps/server/src/auth/**` (RpcAuthorization, EnvironmentAuthPolicy, ServerSecretStore), `docs/internals/environment-auth.md` | full | 100% |
| `apps/server/src/observability/**` (Metrics, Attributes, RpcInstrumentation, Observability, TraceDiagnostics), `usage/**`, `resourceTelemetry/**` | full/mostly + grep | ~70% |
| `.github/workflows/ci.yml`, `package.json`, `docs/internals/ci.md`, `docs/internals/resource-telemetry.md`, `server-updates.md`, `remote.md` | full | 100% |
| `apps/server/src/persistence/**` (OrchestrationEventStore, ProjectionPendingApprovals, AuthSessions), `checkpointing/CheckpointStore`, `terminal/Manager` regions, `sourceControl/SourceControlRateLimit` | full/mostly | ~70% |
| `packages/effect-codex-app-server/**`, `packages/ssh/src/tunnel.ts`, `packages/tailscale/src/tailscale.ts`, `native/resource-monitor/src/main.rs`, Cursor/Grok/OpenCode driver permission translation | enumerated only | 0% (`[NOT VERIFIED]`) |

**Confirmed absences (proven by search):**
- **No provider failover/fallback chain** — `grep fallback|failover|routing|roundRobin` → only text-generation/asset/checkpoint fallbacks; `fallbackTextGenerationProvider` (`serverSettings.ts:240-257`) picks a title-generation provider, not agent turns.
- **No T3-side prompt caching / context compression** — `grep compress|compaction|prompt.cach|cache_control` → only HTTP/WebSocket compression (`http.ts:58`, `server.ts:196-222`).
- **No evals / benchmarks** — `find -iname '*eval*' -o -iname '*benchmark*' -o -iname '*judge*'` → only vendored `.repos/alchemy-effect/benchmark` and `.repos/effect-smol/…/benchmark`.
- **No prompt-injection defense** — `grep prompt.?injection|command.?injection|injection.?attack` → only `apps/web/src/components/chat/composerProviderState.tsx:24,53-55`, a *misnamed* Claude-"ultrathink" marker detector (`isClaudeUltrathinkPrompt`), not an injection defense.
- **No command-level scanning/allowlist for agent commands** — `grep blocklist|denylist` in `apps/server` → only the terminal env-var blocklist (`terminal/Manager.ts:84`), a subagent task-type denylist (`ProviderRuntimeIngestion.ts:325`), and SDK self-description.
- **No retention / export / deletion controls** — `grep retention|GDPR|consent|delete|export|privacy` in `docs/` → only operational/relay/deployment matches.
- **No AI disclosure / bias review** — `grep bias|ethic|disclos|privacy|consent|GDPR` in `docs/` → 0 relevant hits.
- **No learning/memory subsystem** — `rg -i "memory|embedding|semantic|long.?term|remember|preference" apps/server/src` → only per-session scratch (`rememberLastKnownPr`, `rememberTaskDescription`).

---

## 2. Findings per domain

### Domain A — Core & Interface

**A1 Multi-model / providers — 7/10**

*Five built-in drivers, uniformly abstracted.* `CodexDriver, ClaudeDriver, CursorDriver, GrokDriver, OpenCodeDriver` registered in one static array (`apps/server/src/provider/builtInDrivers.ts:47-53`); each driver declares `driverKind` + `configSchema` + a `create` factory producing a scoped adapter (`docs/internals/providers.md:20-24`). Adding a driver needs no orchestration/contract/client change (`providers.md:39-40`). Two registries separate *configuration* from *live processes*: `ProviderInstanceRegistry` materializes adapters in child scopes (`ProviderInstanceRegistryLive.ts:118-214`); `ProviderAdapterRegistry` resolves instance→adapter. **Hot-reload without teardown**: `reconcile` diffs fresh config against live state, closing only removed/replaced scopes (`ProviderInstanceRegistryLive.ts:220-321`); unknown drivers (fork/rollback) emit an `"unavailable"` shadow snapshot instead of failing (`:133-143`). Session recovery adopts a live session or resumes from `resumeCursor` + `modelSelection` + `cwd` (`Layers/ProviderService.ts:410-493`).

*Weaknesses:* **no fallback chain, failover, or model routing** — the only provider "fallback" is `fallbackTextGenerationProvider` for title generation (`serverSettings.ts:240-257`). **Mid-thread model switching is refused, not routed** — `rejectStartedThreadModelChangeIfRequired` errors when a provider sets `requiresNewThreadForModelChange` (`orchestration/Layers/ProviderCommandReactor.ts:437-467`). No cross-provider "try B if A errors" path — provider failures surface as error activities (`appendProviderFailureActivity`, `:329-367`).

**A2 Prompts & context — 4/10**

*T3 owns one real prompt surface.* Codex developer instructions wrap a `<collaboration_mode>` block (Plan `CodexDeveloperInstructions.ts:24-155`, Default `:157-171`) plus a `<runtime_info>` line (`:183-200`); a `preview_*` block is injected *only* when the MCP browser tools are actually attached, and deliberately omitted otherwise (`:3-12,21-22`). **Claude prompt is fully delegated** — the adapter sends `systemPrompt: { type: "preset", preset: "claude_code" }` (`provider/Layers/ClaudeAdapter.ts:4158`). Context files (AGENTS.md/CLAUDE.md) are delegated to the provider CLIs; compaction is *observed*, not performed (`CodexAdapter.ts:236` maps `compact` → `context_compaction`; `opencodeRuntime.ts:205` hard-codes `KNOWN_HIDDEN_AGENTS = ["compaction","summary","title"]`).

*Weaknesses:* no T3-owned system-prompt stability contract, no T3-side compression/summarization/prompt-caching, no per-project context-file templating.

**A3 Agent loop & orchestration — 7/10**

*Event-sourced command→event→projection loop.* `OrchestrationEngine.dispatch` offers a `CommandEnvelope` onto a queue; a single worker fiber processes envelopes totally ordered (`OrchestrationEngine.ts:92-93,323-324`). Idempotent retries via durable receipts (`:140-168`); **atomic persistence + projection** in one SQL transaction (`:186-223`); failure reconciliation re-reads persisted events past the start sequence (`:115-128`). Pure `decider`/`projector` split (`projector.ts:53-56,574`). Three queue-backed drainable workers — `ProviderRuntimeIngestion`, `ProviderCommandReactor`, `CheckpointReactor` (`docs/internals/overview.md:91-101`). Per-turn Git-ref checkpoints (`CheckpointReactor.ts:221-352`); buffered assistant delivery with a 24,000-char spill threshold (`ProviderRuntimeIngestion.ts:101`); turn-start dedup via TTL cache (`ProviderCommandReactor.ts:92-98,314-318`).

*Weaknesses:* the decide→execute→observe loop *inside* a turn is the provider CLI's, not T3's; **no T3-native sub-agent scheduler** (sub-agent events are only *recognized*, `ProviderRuntimeIngestion.ts:321-360`); runtime receipts are test-only (`overview.md:103-105`); pending-approval callback state does not survive restart (`ProviderCommandReactor.ts:271-276`).

**A4 Tools & extensibility — 5/10**

*First-party MCP server + a full ACP client library.* `t3-code` MCP server on `/mcp`, protocol `v2025_06_18` (`McpHttpServer.ts:219-224`); **bearer-token auth scoped per thread/provider** with 401 + `invalid_mcp_credential` on expiry (`:66-93`). Typed tool registry with `Tool.Readonly/Destructive/Idempotent/OpenWorld` annotations surfaced as MCP hints (`toolkits/preview/tools.ts:45-240`, `McpHttpServer.ts:140-149`). `packages/effect-acp` is a full Agent Client Protocol client (`src/client.ts:38-267`).

*Weaknesses:* **narrow tool surface** — only `preview_*` browser tools; no generic filesystem/git/shell/search tools; no user/third-party plugin registration API; browser tools silently stripped on an unreadable settings read (`Layers/ProviderService.ts:251-259`).

### Domain B — Feedforward guides

**B1 Intent specification — 6/10.** `.plans/` holds 31 markdown plans; some are deep and actionable (`.plans/17-claude-agent.md:1-441` has a "why rewritten" preamble, constraints, phased rollout, Effect code sketches, explicit non-goals at `:436-441`; `.plans/11-effect.md:1-40` is a PR-by-PR decomposition). **Weaknesses:** stale index (`.plans/README.md:3-14` lists 12 of 31 plans), no structured task schema (prose only, no frontmatter/status/owner), no lifecycle tracking.

**B2 Skills & playbooks — 7/10.** `.agents/skills/` holds 4 high-quality SKILL.md files (`test-t3-app`, `test-t3-mobile`, `ios-debugger-agent`, `ios-simulator-browser`) with frontmatter, concrete commands and troubleshooting sections; a triage playbook (`.github/triage/PLAYBOOK.md:1-128`); two check-run agents with enforced output contracts (`.macroscope/check-run-agents/`). **Weaknesses:** all four skills target test/verification workflows (no general coding skills); `.claude/skills` is a 17-byte *file* (`../.agents/skills`) that no skill-discovery mechanism follows — dead weight; two divergent skill schemas (`.agents` SKILL.md vs `.macroscope` YAML).

**B3 Project conventions — 8/10.** `AGENTS.md` (147 lines) is highly repo-specific: product invariants (`:7-31`), a glossary with precise actor definitions (`:43-57`), a "hit every surface" checklist (`:65-75`), safe test-data procedure with `VACUUM INTO` (`:86-102`), verification discipline (`:104-110`), PR rules (`:112-119`). `CLAUDE.md` is a clean one-line `@AGENTS.md` import (single source of truth). Conventions are machine-enforced via a custom oxlint plugin (`oxlint-plugin-t3code/rules/`, 5 rules + tests) and macroscope review agents. `docs/internals/glossary.md` links every term to a source path.

*Findings (doc-vs-code):* **stale provider list** — `.cursor/rules/cursor-cloud.mdc:33` lists four providers (no Grok) while code ships a Grok driver and `AGENTS.md:71`/`README.md:5`/`glossary.md:97` state five; **stale dev-workflow** — `.cursor/rules/cursor-cloud.mdc:25-32` documents `npm run dev` with fixed ports and `~/.t3` state, contradicting the current worktree-derived-ports model (`AGENTS.md:79-81`).

**B4 Declared policies — 7/10.** "The three ways to hurt yourself" (`AGENTS.md:59-63`) are three concrete "never" policies. **Rule 3 is machine-enforced and tested** — `scripts/dev-runner.ts:368-369` deletes `VITE_HTTP_URL`/`VITE_WS_URL` and `scripts/dev-runner.test.ts:402-403` asserts `undefined`; this is the strongest case. Rules 1 (kill-by-pattern) and 2 (live-install writes) have no CI gate — they regulate agent behavior and are only verifiable manually. No consolidated policy index.

### Domain C — Feedback sensors

**C1 Tests & verification — 9/10.** 855 `*.test.ts`/`*.spec.ts` files (excluding vendored dirs; 241 in `apps/server` alone). CI has 4 jobs (`ci.yml`): `check` (lint+format `:43`), typecheck (`:46`), `test` (`:90`), `mobile_native_static_analysis`, `release_smoke` (`:164`); plus Rust `cargo fmt --check` (`:49`) and `cargo test --locked` (`:111`). Binary-output verification via grep-asserted exported symbols (`:54-58`). **Weakness:** no code-coverage threshold or gate.

**C2 Evaluation — 1/10 (the gap).** **No evals, LLM-as-judge, benchmarks, or golden sets exist.** `find` for `*eval*`/`*benchmark*`/`*judge*` returns only vendored `.repos` checkouts. `review/ReviewService.ts:89-133` is VCS diff preview, *not* AI review; `textGeneration/` builds prompts for commit messages/PR titles (product features, not evaluation). **Nobody evaluates the quality of the agent's work.**

**C3 Observability — 9/10.** Effect-native metrics (`observability/Metrics.ts` — RPC counters, orchestration timers, provider/git/terminal counters, `withMetrics` wrapper `:98-137`), outcome classification (`Attributes.ts:27-49`), per-method RPC instrumentation with self-observation exclusion (`RpcInstrumentation.ts:18-23`), conditional OTLP traces+metrics (`Observability.ts:46-90`), local file tracer with rotation/byte limits (`:32-45,61-68`), cost/latency aggregation (`usage/usageAggregation.ts`, `usagePricing.ts`), a Rust resource-telemetry sidecar (`docs/internals/resource-telemetry.md`). **Weakness:** OTLP is opt-in — a default install emits no external telemetry (`Observability.ts:78-79,47`); no persistent telemetry DB by design (`resource-telemetry.md:364`).

**C4 Self-correction — 7/10.** Exponential backoff with cap (`NativeTelemetryClient.ts:328-329,717-721`), a bounded-failure circuit breaker with a manual-retry queue (`:679-721`), 8 tagged error classes (`orchestration/Errors.ts:6-103`), tool-error surfacing into the conversation (`ClaudeAdapter.ts:1501,2719`), injected self-correction guidance (`CodexDeveloperInstructions.ts:11`). **Weakness:** resilience is concentrated in the resource-monitor sidecar and infra layers; **no general provider-turn retry or active error-recovery loop**.

### Domain D — Governance, Judgment & Guardrails ★ (the heart)

**D1 Security guardrails — 4/10**

*Present:* secret redaction on the client boundary (`serverSettings.ts:135-162`), terminal env-var blocklist (`terminal/Manager.ts:84,1084-1099`), signed tamper-evident asset URLs with HMAC + `timingSafeEqualBase64Url` (`assets/AssetAccess.ts:368-407`), secret-never-leaks assertions in tests (`CodexSessionRuntime.test.ts:67-91`), HTTP header redaction in tracing (`Observability.ts:1,27`).

*Absent (proven):* **zero prompt-injection defense** (the only "injection" hit is a misnamed ultrathink detector, `composerProviderState.tsx:24,53-55`); **zero T3-side command scanning/allowlist** for the agent's shell commands — they run unscrutinized inside the provider CLI; no output validation/sanitization beyond display concerns (`GitManager.ts:476,1620`, `terminal/Manager.ts:885`).

**D2 Permissions & sandboxing — 7/10 (asymmetric: strong client boundary, weak agent boundary, dangerous default)**

*Strong — the client↔server capability boundary (owned by T3):* **type-enforced per-method scopes** — `RpcAuthorization.ts:23-127` maps every RPC method to a scope, `requiredScopeForRpcMethod` throws at runtime for unscoped methods, and `satisfies Record<WsRpcMethod, AuthEnvironmentScope>` (`:127`) makes an unscoped method a *compile error*. Eight capability scopes (`environment-auth.md:9-28`); ordinary pairing links get client scopes + `relay:read` only (`:25-28`); requested scopes must be a subset of the bootstrap grant (`:76-78`); DPoP proof-of-possession for relay sessions (`:80-93`); policy tiers derived from reachability (`EnvironmentAuthPolicy.ts:20-34`).

*Weak — the agent↔system boundary (delegated, and Full access is the default):* the four modes (Supervised / Auto-accept edits / Auto / Full access) are **not enforced by T3 Code** — they translate into provider settings: Codex `approval-required`→`untrusted`/`read-only` … `full-access`→`never`/`danger-full-access` (`CodexSessionRuntime.ts:265-337`); Claude `full-access`→`bypassPermissions` **and `allowDangerouslySkipPermissions:true`** (`ClaudeAdapter.ts:4167-4170`). **Full access is the default in code** (`serverRuntimeStartup.ts:233-234`, `ClaudeAdapter.ts:3991`, `CodexSessionRuntime.ts:291-292`).

*Doc-vs-code gap:* `permission-modes.md:12` promises "work outside the workspace is restricted" in Supervised mode — true only for Codex/Claude; providers without an equivalent (OpenCode) fall back to prompt-only, **no sandbox**.

**D3 Judgment & decision — 6/10.** Approval pass-through is clean and conservative: provider approval request → `Deferred<ProviderApprovalDecision>` (`ClaudeAdapter.ts:3999-4105`, `CodexAdapter.ts:808-862`) → projected as pending approvals (`ProjectionPipeline.ts:1485-1640`) → human responds via `thread.approval.respond` (`decider.ts:1061-1085`) → forwarded to the adapter. Settle/snooze blocked while a request is pending (`decider.ts:453-490,597-605`). **Weakness:** no T3-level risk classification — "risky" is whatever the provider flags, and in `full-access` (the default) **no approval is ever requested and nothing is escalated** (`CodexSessionRuntime.ts:291-296`).

**D4 Compliance & legal — 3/10.** Append-only event store with full event metadata (`OrchestrationEventStore.ts:35-47,106-130`) — but `inferActorKind` (`:70-90`) records *category* (`client|server|provider`), **not principal** (no subject/sessionId in the event row). Raw provider events logged verbatim to NDJSON (`ProviderEventLoggers.ts:43-49,65-88`); terminal history to `terminalLogsDir` (`terminal/Manager.ts:1133,1152`). **Telemetry on by default with a hardcoded key, no consent** (`telemetry/AnalyticsService.ts:31-44`, `T3CODE_TELEMETRY_ENABLED` default `true`; opt-out is env-var only). **No retention, export, or deletion controls** anywhere in `docs/`.

**D5 Ethics & disclosure — 1/10.** No AI-disclosure statement, no bias/limitations review, no ethics contact in `README.md` (120 lines) or `docs/`. The only honesty signals are functional (permission-modes.md accurately describes delegated enforcement; README is transparent that T3 controls "agents on your machine"), not ethical.

### Domain E — Lifecycle & learning

**E1 Memory & learning — 2/10.** **Event-sourced but not self-learning.** Durable thread/project state and passive *discovery* of provider-native skills (`ClaudeSkills.ts:95-155`), but no persistent memory, no self-generated skills, no curation, no long-term feedback loop. The only "memory" hits are per-session scratch (`rememberLastKnownPr`, `rememberTaskDescription`). `ThreadBackgroundLiveness` is in-memory and empty after restart (`:7-10`).

**E2 Steering loop human — 7/10.** A rich turn-level intervention surface: plan-mode gate (`CodexDeveloperInstructions.ts:24-155`), durable pending-approval projection (`ProjectionPendingApprovals.ts:24-92`), review diffs with workspace-bound path validation (`ReviewService.ts:65-138`), thread lifecycle controls (snooze/settle/pin/archive as schema migrations), and a cost dashboard. Improvement evidence is human-authored code review (`ThreadBackgroundLiveness.ts:91,113` carry "review finding" annotations) — proof the harness *improves via review*, but not that it *learns*.

### Domain F — Operational

**F1 Execution & environments — 7/10.** One runtime boundary, four connection targets (`PrimaryConnectionTarget`, `BearerConnectionTarget`, `RelayConnectionTarget`, `SshConnectionTarget` — `docs/internals/remote.md:51-64,91-101`). Stable `environmentId` persisted on first start (`remote.md:40-42`). SSH launch with explicit failure handling (`packages/ssh/src/tunnel.ts`, `remote.md:161-176`); Tailscale serve acquire/release. **Sandbox = git worktrees, not OS/container isolation** (`ReviewService.ts:65-87`, `CheckpointStore.ts:56-60`). Resource monitor runs as a separate process (failure boundary). *Weakness:* no container/VM/OS-level sandbox; WSL has no native process telemetry (`resource-telemetry.md:60-69`).

**F2 Cost & efficiency — 7/10.** **Cost telemetry is unusually strong** — `UsageService` prices provider transcripts via LiteLLM pricing, memoized and deduped, 90-day disk cache (`UsageService.ts:56-70,130-258,293-443`); rate-limit-aware backoff with generation leases (`SourceControlRateLimit.ts:13-14,66-157`); GitHub GraphQL cost budget (`githubGraphQlBudget.ts:11-73`). **But no token/cost budget enforcement** — `max_tokens` is a passthrough, `budgetTokens` is a thinking option, no per-turn/per-thread cap. BYO-subscription model; offline rates make models "unpriced" rather than blocking (`UsageService.ts:167-179`).

**F3 Resilience — 8/10.** Event-sourced durability (`OrchestrationEventStore.ts:106-158,211-261`), Git-checkpoint restore with `fallbackToHead` (`CheckpointStore.ts:56-96`), staged server updates with rollback (`server-updates.md:30-75`), supervised sidecar with circuit breaker (`NativeTelemetryClient.ts:690-722`), deterministic drain primitive (`DrainableWorker.ts:40-70`). *Weaknesses:* background-liveness is in-memory and lost on restart (intentional, `ThreadBackgroundLiveness.ts:7-10`); **no cross-process failover / leader election** (single-instance by design).

---

## 3. Score table

| A1 | A2 | A3 | A4 | B1 | B2 | B3 | B4 | C1 | C2 | C3 | C4 | D1 | D2 | D3 | D4 | D5 | E1 | E2 | F1 | F2 | F3 |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 7  | 4  | 7  | 5  | 6  | 7  | 8  | 7  | 9  | 1  | 9  | 7  | 4  | 7  | 6  | 3  | 1  | 2  | 7  | 7  | 7  | 8  |

**HCI (composite, rubric v1):** 129 / 22 = **5.86 → 59 / 100**.

---

## 4. Portable patterns (the idea, not the code)

1. **Type-enforced authorization coverage** (`RpcAuthorization.ts:23-138`): a `satisfies Record<RpcMethod, Scope>` map makes "added an RPC without choosing a scope" a *compile error*, with a runtime throw for drift — the single best governance pattern in the codebase.
2. **Driver = `driverKind` + `configSchema` + `create`-in-child-scope**, with config/live registry split for diff-only hot-reload (`ProviderInstanceRegistryLive.ts:220-321`).
3. **Event-sourced command loop with durable receipts + single-transaction project** for idempotent retries and a read model that can't disagree with the log (`OrchestrationEngine.ts:140-223`).
4. **Queue-backed "drainable workers" with a `drain()` test hook** (`DrainableWorker.ts:40-70`, `overview.md:91-101`).
5. **`CLAUDE.md` as a one-line `@AGENTS.md` import** — a single canonical guide, no duplication across agent runtimes.
6. **Concrete, testable "never" rule with a code-level witness** (`dev-runner.ts` deleting forbidden env vars + a test asserting `undefined`).
7. **Deferred-based approval pass-through** (`ClaudeAdapter.ts:3999-4105`) — bridges async provider requests to the human UI without coupling layers.
8. **Sidecar-as-failure-boundary** — native monitoring in a separate Rust process, not a Node addon (`resource-telemetry.md:21-34`).
9. **Rate-limit lease with a generation counter** (`SourceControlRateLimit.ts:66-71,110-140`).

## 5. Pitfalls

1. **Delegated enforcement is silent failure.** If a provider CLI doesn't implement the requested sandbox/approval policy, T3 Code has no independent check — "Auto"/"Supervised" silently degrade to provider defaults.
2. **The default is the most dangerous mode.** "Full access" (bypass + `danger-full-access`) is the code default (`serverRuntimeStartup.ts:234`, `ClaudeAdapter.ts:3991`).
3. **Doc-vs-code gap on sandboxing.** `permission-modes.md:12` promises workspace restriction that only some providers enforce.
4. **Audit trail lacks actor identity.** `actorKind ∈ {client,server,provider}` records *category*, not *principal* (`OrchestrationEventStore.ts:70-90`).
5. **Telemetry defaults on, consent is env-var-only, key is hardcoded** (`AnalyticsService.ts:33,38`).
6. **Raw provider NDJSON logs** persist prompts/tool output with no observed redaction layer.
7. **Wrapping provider CLIs means the reasoning loop, context compression and sub-agent scheduling are all delegated** — high orchestration scores but low scores on anything requiring control *inside* the turn.
8. **Vendored checkouts inflate metrics** — prune `.repos/`, `patches/`, `native/`, `node_modules` before citing counts.

## 6. Prioritized recommendations (impact × effort)

| # | Recommendation | Impact | Effort | Dependency |
|---|---|---|---|---|
| 1 | Ship **Supervised** (or first-run mode picker) as the default instead of Full access | High | Low | — |
| 2 | Add a provider-agnostic **command/allowlist scan** at the T3 terminal boundary, or at minimum a visible warning when a provider lacks sandboxing | High | Medium | D2 mapping |
| 3 | Add **evals / LLM-as-judge** for the text-generation and review features | Medium | High | — |
| 4 | Add **consent + retention/export/delete** for telemetry and stored data | High (compliance) | Medium | — |
| 5 | Add an **AI-disclosure + limitations** statement to README/docs | Low→Medium | Trivial | — |
| 6 | Persist **actor identity (subject)** in the event store rows | Medium | Medium | persistence |
| 7 | Reconcile stale `.cursor/rules` (provider list, dev workflow) with code | Low | Trivial | — |

## 7. Limitations

`packages/effect-codex-app-server/**`, `packages/ssh/src/tunnel.ts`, `packages/tailscale/src/tailscale.ts`, `native/resource-monitor/src/main.rs`, and the Cursor/Grok/OpenCode driver permission-translation code were enumerated but **not line-read** — scores for F1 (partly) and the non-Codex/Claude halves of D2 rest on their documentation, and are marked `[NOT VERIFIED]`. `ProviderCommandReactor.ts` (1442 lines), `ProviderRuntimeIngestion.ts` (2088 lines), `ClaudeAdapter.ts` (4644 lines) and `CheckpointReactor.ts` (946 lines) were read in representative windows plus grep, not cover-to-cover. Runtime measurements (cache hit rates, latencies, real costs) are out of scope for a read-only audit. An audit that declares no limitations was not honest about its coverage.
