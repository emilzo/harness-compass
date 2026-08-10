---
name: audit-harness
description: Pipeline semi-automático de auditoria de um harness submetido (22 dimensões) — clone/pin, workflow multi-agente (domínios paralelos + consolidação + verificação adversarial), draft para sign-off humano de 15–30 min, e publicação após aprovação. Usar quando há uma submissão (issue harness-submission) ou quando o utilizador pede "audita o harness X".
---

# Audit Harness — pipeline de submissão → sign-off → publicação

O objetivo é reduzir o trabalho humano ao **sign-off** (15–30 min por harness,
agrupável em lote). Tudo o resto é automatizado por este procedimento.

## Entrada

Uma submissão via issue `harness-submission` (nome, vendor, URL do repo, track,
JSON preliminar exportado da app) ou um pedido direto do utilizador com o alvo.

## Passo 1 — Pré-flight (sessão, automático)

1. `git clone <repoUrl>` para uma pasta de trabalho local (fora deste repo).
2. Fixar o snapshot: `git -C <checkout> rev-parse HEAD` → guardar o SHA.
3. Registar o track (pública / privada) — determina o destino do relatório no passo 4.

## Passo 2 — Workflow multi-agente (automático)

Invocar o workflow gravado `audit-harness` (em `.claude/workflows/audit-harness.js`)
com `args: { path: "<checkout>", sha: "<SHA>", name: "<slug>", repoUrl: "<url>" }`.

O workflow produz `docs/audits/DRAFT-<slug>.md` no formato do
`docs/audits/AUDIT-TEMPLATE.md`: 6 domínios lidos em paralelo (read-only,
`path:line` obrigatório, ausências provadas por grep, cobertura declarada),
consolidação, e **verificação adversarial das 12 citações-chave** por agentes
independentes. Se houver citações REFUTED/NOT_FOUND, corrigi-las (re-ler a fonte,
ajustar claim ou score) e re-verificar ANTES de apresentar ao humano.

## Passo 3 — Sign-off humano (a única parte do utilizador)

Apresentar ao utilizador, numa mensagem única e curta:
- o sumário executivo do draft + a tabela dos 22 scores;
- a tabela de verificação (todas CONFIRMED, ou o que foi corrigido);
- as 3 citações sugeridas para spot-check manual (as mais determinantes).

O utilizador: spot-checka ≥3 citações, aprova/ajusta scores, e diz "aprovo"
(pode fazer vários harnesses em lote numa sentada). **Sem aprovação explícita,
nada é publicado — este gate nunca é removido.**

## Passo 4 — Publicação (automático, após aprovação)

**Track pública:**
1. Renomear `DRAFT-<slug>.md` → `docs/audits/<slug>.md`; apagar a secção SIGN-OFF.
2. Entrada em `BUILTIN_HARNESSES` (`index.html`): 22 scores, `audited:true`,
   `evidence:"docs/audits/<slug>.md"`, tags, blurb com chaves i18n EN+PT mínimo.
3. `npm test` (o teste 23 valida a evidência; check-i18n valida as chaves) → verde.
4. Commit; PR se houver remote, senão commit em main local. Responder ao issue
   da submissão com o link do relatório e do ranking.

**Track privada:** o relatório NÃO entra no repo. Entregar o ficheiro ao
submissor pelo canal combinado, apagar o draft do working tree, e nada muda no
ranking (política: badge público exige evidência pública — sem exceções).

## Regras

- Read-only sobre o código auditado; nada é executado.
- Um score sem citação verificada não sobrevive ao draft.
- A secção Limitações nunca é esvaziada para "ficar melhor" — cobertura honesta
  é o produto.
- Custo/tempo esperado por harness: ~10-13 agentes de workflow + 15–30 min de
  sign-off humano.
