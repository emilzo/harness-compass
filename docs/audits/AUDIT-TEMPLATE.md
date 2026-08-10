# HARNESS AUDIT — <name> (line-by-line)

**Date:** YYYY-MM-DD · **Mode:** read-only (nothing executed or modified)
**Target:** <repo URL> @ commit `<SHA>` (pin the exact snapshot — line references drift)
**Methodology:** [`references/harness-map.md`](../../references/harness-map.md) taxonomy ·
parallel deep-reads per domain · single consolidation · every claim cites a verified `path:line`
**Track:** ☐ public (report published here, AUDITED badge) · ☐ private (report delivered
to submitter only, no public listing — see the confidentiality policy in CONTRIBUTING.md)

---

## 0. Executive summary

Two or three paragraphs: what this harness is structurally obsessed with, where it is
mature (with scores), where it is fragile (with scores), and the composite per domain.

## 1. Declared coverage

| Area / file | Read | % |
|---|---|---|
| … | INTEGRAL / windows / greps only | … |

**Confirmed absences:** claims of nonexistence proven by search (quote the grep).

## 2. Findings per domain (A1…F3)

For each of the 22 dimensions: **score /10** + the mechanisms that earn it, each cited as
`file.ext:line-range`, and the weaknesses, equally cited. Rules:

- A mechanism you did not read does not score. Mark unread claims `[NOT VERIFIED]`
  with the command that would resolve them.
- Absences count as evidence when proven (`grep X → 0` inside the read scope).
- Runtime measurements (cache hit rates, latencies, real costs) require execution —
  out of scope for a read-only audit; mark them `[NOT VERIFIED]`.

## 3. Score table

| A1 | A2 | A3 | A4 | B1 | B2 | B3 | B4 | C1 | C2 | C3 | C4 | D1 | D2 | D3 | D4 | D5 | E1 | E2 | F1 | F2 | F3 |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |

**HCI (composite):** plain average of the 22.

## 4. Portable patterns (the idea, not the code)

What other harnesses should copy, each anchored to its source mechanism.

## 5. Pitfalls

Engineering traps observed — what a porter or the maintainers should avoid.

## 6. Prioritized recommendations (impact × effort)

| # | Recommendation | Impact | Effort | Dependency |
|---|---|---|---|---|

## 7. Limitations

Unread areas, `[NOT VERIFIED]` items with resolving commands, and anything that
bounds the confidence of the scores. **An audit that declares no limitations was
not honest about its coverage.**
