# 🧭 Harness Compass

**Agent = Model + Harness.** O harness é tudo o que não é o modelo: guias, loop, ferramentas, permissões, sandbox, verificação, observabilidade, custo. Este projeto ajuda-te a **escolher o harness certo** — e a perceber que, com um harness potente, **os LLMs económicos chegam lá**.

> "Loops coordenam. Harnesses guiam, executam, verificam e decidem. Modelos geram."

## O que é

Uma web app de página única (zero dependências, zero build) com 7 vistas:

1. **Paradigma** — por que o harness decide quanto do teu dinheiro em tokens é desperdiçado.
2. **Ranking** — harnesses classificados por **22 dimensões** com score composto 0–10, fingerprint radar e donut por harness; ordenável e filtrável. Dados **AUDITADOS** (evidência `path:line`), **PRELIMINARES** (análise local) e **ESTIMATIVAS** distinguidos — discernimento, não propaganda.
3. **Mapa do Harness** — a taxonomia completa (6 domínios × 22 dimensões) usada para auditar qualquer harness.
4. **📂 Auditar uma pasta** — abre a pasta de um repo local; a app lê até 300 ficheiros, deteta sinais objetivos (AGENTS.md, testes, CI, skills, security patterns, custo…) e produz scores preliminares para as 22 dimensões com justificação visível por dimensão. Ajusta os sliders, **adiciona ao ranking** (badge Preliminar) e **exporta JSON** para contribuir. 100% local — nada sai da tua máquina. (Validado contra o Hermes: erro médio ~1.6/dimensão vs auditoria real.)
5. **Quiz de decisão** — 6 perguntas ponderam as dimensões pelo teu perfil e recomendam os 3 harnesses com justificação.
6. **Calculadora de economia** — quanto poupas por mês em tokens com cache, retry inteligente, compressão e routing.
7. **Método & evidência** — escala de maturidade, como funciona a auditoria local, estudos de caso, como contribuir.

## Compatibilidade

| Recurso | Chrome / Edge | Firefox | Safari | Nota |
|---|---|---|---|---|
| Ranking, mapa, quiz, calculadora, gráficos | ✅ | ✅ | ✅ | HTML/CSS/JS padrão, zero dependências |
| Auditar pasta (seletor moderno) | ✅ | — | — | Requer HTTPS (GitHub Pages) ou localhost |
| Auditar pasta (fallback clássico) | ✅ | ✅ | ⚠️ parcial | Safari não devolve a hierarquia de pastas de forma fiável |
| `file://` (duplo clique) | ✅ (fallback) | ✅ | ✅ | O seletor moderno cai no clássico automaticamente |

**Mac, Windows, Linux:** comportamento idêntico — as APIs dependem do browser, não do SO. Para a melhor experiência de auditoria de pastas: **Chrome ou Edge com a app publicada em GitHub Pages** (HTTPS).

## Como usar

```bash
# 1. Abre em qualquer browser (duplo clique serve — é um ficheiro só):
open index.html        # macOS / Linux
start index.html       # Windows

# 2. Ou publica no GitHub Pages: push do repo → Settings → Pages → branch main
```

## O paradigma (a tese)

O preço de um LLM não é o preço do modelo — é o preço do modelo **vezes o desperdício do harness**:

- Sem caching byte-estável → pagas o mesmo prefixo vezes sem conta.
- Sem retry/fallback inteligente → falhas transitórias viram chamadas mortas e tempo do dev.
- Sem compressão → conversas longas rebentam a janela e perdem contexto.
- Sem routing → pagas o modelo caro para tarefas que o barato resolve.

Um harness potente (Hermes, Kando, os coding agents maduros) **recupera o preço dele na primeira semana**. A calculadora quantifica isto com os teus números.

## Estado dos dados

| Harness | Status | Nota |
|---|---|---|
| Hermes Agent (Nous Research) | ✅ Auditado | 22 dimensões, evidência file:line — ver `docs/` |
| Kando (DevFactoryAI) | ✅ Auditado | idem |
| Claude Code, Codex CLI, Cursor, Cline, OpenClaw, claude-code-router, LangGraph, CrewAI | 🔶 Estimativa | avaliação informada, a validar por auditoria |

## Como contribuir

1. **Adicionar/afinar um harness**: edita o array `HARNESSES` no fim de `index.html` — cada entrada tem 22 scores (0–10), `audited: true/false`, tags e um blurb. Faz um PR.
2. **Auditar um harness a sério**: segue o método em `docs/` (taxonomia + escala + regras de evidência) e muda `audited` para `true` com os relatórios.
3. **Melhorar o mapa ou o quiz**: PR bem-vindo.

**Regra de ouro do projeto:** dados auditados e estimativas **nunca** se misturam sem etiqueta.

## Método

- **Taxonomia:** 6 domínios × 22 dimensões (A Núcleo · B Guias · C Sensores · D Governação ★ · E Aprendizagem · F Operacional).
- **Escala 0–10:** 0 = não existe (provado) · 2 = vestígio · 4 = caso simples · 6 = integrado com gaps · 8 = sólido com testes · 10 = razão de existir.
- **Evidência:** auditorias read-only; cada afirmação cita `path:line` verificado; ausências provadas por busca; cobertura declarada.
- **Foco obrigatório:** domínio D — governação, julgamento, compliance, guardrails.

## Estudos de caso

- `docs/HARNESS-AUDIT-HERMES-VS-KANDO.md` — comparação completa (22 dimensões, ~190K caracteres de evidência, 9 auditorias paralelas).
- `docs/DEEP-HARNESS-AUDIT-HERMES.md` — deep audit linha-a-linha do Hermes (15 achados, KPIs, 15 padrões portáveis, 10 recomendações).

## Licença

MIT — ver `LICENSE`.
