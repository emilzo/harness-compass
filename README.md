# 🧭 Harness Compass

**Agent = Model + Harness.** O harness é tudo o que não é o modelo: guias, loop, ferramentas, permissões, sandbox, verificação, observabilidade, custo. Este projeto ajuda-te a **escolher o harness certo** — e a perceber que, com um harness potente, **os LLMs económicos chegam lá**.

> "Loops coordenam. Harnesses guiam, executam, verificam e decidem. Modelos geram."

## O que é

Uma web app de página única (zero dependências em runtime, zero build — jsdom existe apenas como devDependency da suite de testes) com 8 vistas:

1. **Paradigma** — por que o harness decide quanto do teu dinheiro em tokens é desperdiçado.
2. **Ranking** — harnesses classificados por **22 dimensões** com o **HCI (Harness Compass Index)** 0–10, fingerprint radar e donut; ordenável, filtrável por domínio e por proveniência (integridade). AUDITADO / PRELIMINAR / ESTIMATIVA / LOCAL sempre distinguidos.
3. **💰 Custo real** — *Same Model, Different Harness*: o mesmo volume de trabalho, o mesmo modelo, através de cada harness → **custo real por tarefa (harness-adjusted)** com cache/retry/routing derivados dos scores, preços reais do OpenRouter e ranking por custo. É o "Cost per Task" do Artificial Analysis aplicado à camada.
4. **Mapa do Harness** — a taxonomia completa (6 domínios × 22 dimensões).
5. **📂 Auditar uma pasta** — abre a pasta de um repo local; análise heurística das 22 dimensões com justificações, sliders ajustáveis (ajustes ficam marcados — integridade), plano de melhoria, adição ao ranking e export JSON. 100% local.
6. **Quiz de decisão** — 6 perguntas ponderam as dimensões pelo teu perfil e recomendam os 3 harnesses com justificação.
7. **Calculadora de economia** — quanto poupas por mês em tokens com cache, retry, compressão e routing.
8. **Método & evidência** — escala de maturidade, integridade, como funciona a auditoria local, estudos de caso.

O **benchmark padronizado** (o "ARC dos harnesses" — cenários B1–B8, protocolo de submissão, leaderboard) está especificado em `BENCHMARK-SPEC.md` — o roadmap do golpe de autoridade.

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
3. **Melhorar a base de conhecimento**: o mapa `IMPROVEMENT_PATTERNS` (recomendações por dimensão, com o mecanismo-fonte citado) cresce a cada auditoria. Cada padrão novo = um PR — é assim que os rankings e os conselhos ficam mais precisos e robustos.
4. **Melhorar o mapa ou o quiz**: PR bem-vindo.

**Regra de ouro do projeto:** dados auditados, preliminares e estimativas **nunca** se misturam sem etiqueta.

## Integridade do ranking (como é que "a sério" funciona)

**Pergunta legítima: não pode alguém mexer nos pesos, guardar e rankear em primeiro?** Resposta: na sessão local de cada pessoa, sim — e é irrelevante, porque o ranking *oficial* não vem dos browsers das pessoas. É assim que funciona:

1. **O ranking oficial vive no repo** — o array `HARNESSES` em `index.html`. Entra por **PR revisto**, não por download.
2. **O badge AUDITADO exige relatório** — evidência `path:line` real, como os que estão em `docs/`. Sem relatório, sem badge.
3. **Tudo o que adicionas localmente fica marcado LOCAL** — e qualquer ajuste manual aos sliders fica **visível**: contador de "⚠ N dimensões ajustadas" no badge, e o export JSON carrega a proveniência (`meta.heuristica` = o que a análise detetou vs o que tu mudaste).
4. **O princípio não é impedir a mentira — é torná-la visível.** Quem abre o ranking vê imediatamente o que é verificado, o que é estimativa e o que foi mexido à mão.

**Fluxo honesto para rankear um harness:**
1. Audita a pasta → badge Preliminar (só com justificações da análise)
2. Ajusta o que quiseres → fica marcado (divergência visível)
3. Auditoria completa com relatório → submete via PR → badge Auditado oficial
4. O harness entra no ranking do projeto para toda a gente — com a prova junta.

## Ciclo de melhoria contínua (como o Compass fica mais esperto)

1. **Auditoria local** (badge Preliminar) → primeiro corte em minutos.
2. **Plano de melhoria** → o Compass aponta os gaps (dimensões < 6) com padrões provados e níveis de maturidade L1–L5 ("o que falta, o que fazer").
3. **Auditoria completa** (badge Auditado) → scores definitivos com evidência.
4. **Recalibração** → cada par (heurística vs auditada) é comparado e os pesos da heurística afiam-se (validado contra o Hermes: erro médio ~1.6/dimensão).
5. **Base de conhecimento** → cada padrão novo entra no `IMPROVEMENT_PATTERNS` e beneficia todos os harnesses futuros.

## Método

- **Taxonomia:** 6 domínios × 22 dimensões (A Núcleo · B Guias · C Sensores · D Governação ★ · E Aprendizagem · F Operacional).
- **Escala 0–10:** 0 = não existe (provado) · 2 = vestígio · 4 = caso simples · 6 = integrado com gaps · 8 = sólido com testes · 10 = razão de existir.
- **Evidência:** auditorias read-only; cada afirmação cita `path:line` verificado; ausências provadas por busca; cobertura declarada.
- **Foco obrigatório:** domínio D — governação, julgamento, compliance, guardrails.

## Estudos de caso

- `docs/HARNESS-AUDIT-HERMES-VS-KANDO.md` — comparação completa (22 dimensões, ~190K caracteres de evidência, 9 auditorias paralelas).
- `docs/DEEP-HARNESS-AUDIT-HERMES.md` — deep audit linha-a-linha do Hermes (15 achados, KPIs, 15 padrões portáveis, 10 recomendações).

## Licença e integridade

**Licença: AGPL-3.0** — o código é aberto, mas quem fornecer uma versão derivada como serviço (SaaS) é obrigado a publicar o código-fonte. Isto protege o projeto contra forks que o revendam fechado.

**O que é público vs retido:** o código, a taxonomia e as auditorias publicadas são a prova e o ímã. O **dataset vivo** (auditorias novas, telemetria agregada, scores em evolução) e o **selo de auditoria certificada** são ativos do projeto que não se forkiam — o que se publica hoje determina o que se pode vender amanhã.

## Internacionalização (i18n)

Seletor de idioma no topo — **Inglês é a norma**, com Português, Francês, Alemão, Mandarim e Hindi. O dicionário vive no topo do `index.html` (`const T = {...}`): traduções parciais caem para Inglês (fallback), e qualquer pessoa pode corrigir termos ou adicionar uma língua via PR. **As 6 línguas estão completas — 329/329 chaves cada** (blurbs, 22 dimensões, 64 padrões de melhoria, quiz, auditoria, método). **Para adicionar uma língua nova:** copia o bloco `pt:{...}` do dicionário, traduz os valores e muda o seletor `LANGUAGES` — o `check-i18n.js` valida automaticamente chaves e placeholders — ou abre um PR.

**Tema claro/escuro:** botão ☀️/🌙 no topo — respeita a preferência do sistema na primeira visita e lembra a tua escolha (localStorage).

**Assinatura:** público → **@emilzo** (nome do repo) no rodapé; internamente → @eluminaime · @emilzo · Agent Hermes (Tom).

## Constância de modelos (preços sempre atuais)

- **Fonte viva:** a lista de modelos vem do OpenRouter a cada carregamento da app — quando um provider fecha um modelo, ele desaparece automaticamente do seletor; os novos aparecem no mesmo dia.
- **Diff local:** a app guarda um snapshot no teu browser e mostra o que mudou desde a última visita ("🆕 N novos · 📦 M saíram desde …").
- **Histórico local de descontinuados:** os modelos que saem ficam registados (nome, data, último preço) numa lista colapsável — útil para proveniência de pricing e continuidade de auditorias.
- **Histórico global (público):** o GitHub Actions corre `scripts/snapshot-models.mjs` diariamente e commita `docs/models/latest.json` + `docs/models/history.json` — o dataset aberto e versionado de modelos (o que a app sozinha não pode guardar). Dados abertos = ativo e prova.

## Garantia i18n (norma obrigatória)

`node check-i18n.js` valida (exit 1 se falhar):
- [x] Chaves em **EN e PT** para qualquer funcionalidade nova (as outras línguas reportam fallback)
- [x] Chaves **table-driven** (`dim_*`, `imp_*`, `quiz_*`, `lv_*`, `blurb_*`, `dom_*`) — as ~160 chaves que chegam ao `t()` por variável
- [x] `t("chave")` literal (aspas duplas, simples ou template) sem chave em EN
- [x] **Placeholders `{x}` consistentes** entre EN e cada língua (um typo `{N}` vs `{n}` falha)
- [x] Chaves órfãs (existem numa língua mas não em EN) e duplicadas no mesmo bloco
- [x] Línguas declaradas em `LANGUAGES` vs blocos do dicionário (nenhuma língua fica invisível ao check)
- [x] Interpolação em atributos HTML (`value`/`title`/`placeholder`/…) **sem `esc()`** — em qualquer posição do valor (injeção latente)
- [x] Interpolações de conteúdo fora da allowlist auditada (aviso; zero avisos em árvore limpa)

## Testes (automatizados + smoke manual)

**`npm test`** corre o `check-i18n.js` + a **suite de regressão jsdom com 22 cenários** (`test/regression.mjs`) — quiz e auditoria preservados na troca de língua, reset/cancel sem ressurreição de estado, matcher case-insensitive, cache sem envenenamento, re-entrância do picker, widgets OpenRouter, CTA da home, pills, variáveis de tema nos SVG, navegação por teclado, status re-traduzível. O CI (`.github/workflows/ci.yml`) corre isto em **cada push/PR** — nenhuma destas classes de regressão pode voltar sem o CI ficar vermelho.

Smoke manual recomendado antes de um release (Chrome, `python -m http.server 8123`):

1. **Temas:** em claro e escuro, badges, chips A–F, avisos, pills, donut e radar legíveis.
2. **Offline/CORS:** com a rede cortada, a vista de Custo mostra o aviso de preços manuais e continua a funcionar.
3. **Fallback do picker:** em Firefox (sem `showDirectoryPicker`) a auditoria funciona pelo seletor clássico; cancelar mostra "Cancelado." de imediato.

Depois de passar: `npm test` verde → commit.
