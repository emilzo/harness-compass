## What & why

<!-- One concern per PR. Which of the CONTRIBUTING tracks is this? -->

## Checklist

- [ ] `npm test` green (check-i18n + 22-scenario regression suite)
- [ ] New UI strings have `t()`/`data-i18n` keys in **EN and PT** at minimum (check-i18n enforces)
- [ ] If adding/changing a harness entry: 22 scores justified in this description; `audited:false` unless…
- [ ] …the entry ships `audited:true`: evidence report added under `docs/audits/` (per `AUDIT-TEMPLATE.md`) **and** the `evidence` field points to it
- [ ] No unrelated changes bundled
