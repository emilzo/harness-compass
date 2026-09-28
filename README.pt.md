# 🧭 Harness Compass

[English](README.md) · **Português**

**Live: https://emilzo.github.io/harness-compass/**

**Pré-visualização de investigação v0.1**

Scorecard de maturidade de arquitetura, baseado em evidência, para harnesses de agentes de IA. O harness é tudo o que não é o modelo: guias, loop, ferramentas, permissões, *sandbox*, verificação, observabilidade e custos. O scorecard compara maturidade de arquitetura. O benchmark comportamental B1–B8 planeado fica separado e não está implementado. Já existem benchmarks de desempenho de scaffolds de agentes, incluindo o [Terminal-Bench](https://www.tbench.ai/leaderboard), o [Coding Agent Index da Artificial Analysis](https://artificialanalysis.ai/agents/coding-agents) e o [HAL](https://hal.cs.princeton.edu/).

> "Loops coordenam. Harnesses guiam, executam, verificam e decidem. Modelos geram."

## O que é

Uma web app de página única (zero dependências em runtime, zero build, jsdom existe apenas como devDependency da suite de testes) com 8 vistas:

1. **Paradigma**: por que o harness decide quanto do teu dinheiro em tokens é desperdiçado.
2. **Ranking**: harnesses classificados por **22 dimensões** com o **HCI (Harness Compass Index) 0–100** (dimensões 0–10 na rubrica de maturidade **v1**). Um 10 continua por cumprir: verificação formal, aprendizagem com resultados medidos, uma execução B1–B8 revista, ou optimalidade de custo contra uma linha de base. Há 9s. O Hermes Agent tem 9 em A2, C1 e F3. O T3 Code tem 9 em C1 e C3. O melhor HCI atual é 75. A lista por omissão mostra só entradas auditadas. As estimativas ficam atrás de um controlo, sem posição, com uma nota sobre como foram atribuídas. Fingerprint radar e donut; ordenável, filtrável por domínio e por proveniência. O HCI é um scorecard de maturidade de arquitetura. Não é um benchmark de desempenho em tarefas. AUDITADO / PRELIMINAR / ESTIMATIVA / LOCAL ficam sempre separados.
3. **Custo modelado (ilustrativo)**: uma carga mensal de tokens assumida, em dois resultados. (a) Modelo premium isolado: pressupostos de cache, compressão e falhas evitadas, sem routing. (b) Com routing para o modelo económico, com essa etiqueta. A unidade é dólares por mês. Não é uma medição e não é um custo por tarefa. O custo por tarefa medido está planeado no cenário B8 e não está implementado. Volumes e preços por omissão são pressupostos. Ver [Pressupostos do modelo de custo](#pressupostos-do-modelo-de-custo).
4. **Mapa do Harness**: a taxonomia completa (6 domínios × 22 dimensões).
5. **📂 Auditar um repositório local**: abre a pasta do repo; análise heurística das 22 dimensões com justificações, sliders ajustáveis (ajustes ficam marcados — integridade), plano de melhoria, adição ao ranking e export JSON. O código fica no browser e não é enviado.
6. **Quiz de decisão**: 6 perguntas ponderam as dimensões pelo teu perfil e recomendam os 3 harnesses com justificação.
7. **Calculadora**: a mesma carga mensal assumida, com resultados separados para o modelo premium isolado e para o routing para o modelo económico. Os valores por omissão dos controlos são pressupostos.
8. **Método & evidência**: escala de maturidade, integridade, como funciona a auditoria local, estudos de caso.

A spec aberta do benchmark comportamental (cenários B1–B8, protocolo de submissão e um futuro leaderboard revisto) está em `BENCHMARK-SPEC.md`. É separada do score arquitetural HCI.

## Compatibilidade

| Recurso | Chrome / Edge | Firefox | Safari | Nota |
|---|---|---|---|---|
| Ranking, mapa, quiz, calculadora, gráficos | ✅ | ✅ | ✅ | HTML/CSS/JS padrão, zero dependências |
| Auditar pasta (seletor moderno) | ✅ | — | — | Requer HTTPS (GitHub Pages) ou localhost |
| Auditar pasta (fallback clássico) | ✅ | ✅ | ⚠️ parcial | Safari não devolve a hierarquia de pastas de forma fiável |
| `file://` (duplo clique) | ✅ (fallback) | ✅ | ✅ | O seletor moderno cai no clássico automaticamente |

**Mac, Windows, Linux:** comportamento idêntico Ás APIs dependem do browser, não do SO. Para a melhor experiência de auditoria de pastas: **Chrome ou Edge com a app publicada em GitHub Pages** (HTTPS).

## Como usar

```bash
# 0. Ou abre simplesmente a app live: https://emilzo.github.io/harness-compass/

# 1. Abre em qualquer browser (duplo clique serve — é um ficheiro só):
open index.html        # macOS / Linux
start index.html       # Windows

# 2. Ou publica no GitHub Pages: push do repo → Settings → Pages → branch main
```

## O paradigma (a tese)

O preço de um LLM não é o preço do modelo. É o preço do modelo **vezes o desperdício do harness**:

- Sem caching byte-estável pagas o mesmo prefixo vezes sem conta.
- Sem retry/fallback inteligente falhas transitórias viram chamadas mortas e tempo do dev.
- Sem compressão conversas longas rebentam a janela e perdem contexto.
- Sem routing, neste modelo, cada chamada usa o preço premium.

Este projeto não afirma que um harness forte faz um modelo mais barato igualar um mais caro. As ligações acima são benchmarks de tarefas de scaffolds de agentes. Não são evidência dessa afirmação.

## Estado dos dados

| Harness | Status | Nota |
|---|---|---|
| Hermes Agent (Nous Research) | ✅ Auditado | 22 dimensões, evidência file:line, ver `docs/` |
| Kando (DevFactoryAI) | Produto do próprio autor, não classificado | Construído pelo autor do Harness Compass (Emílio, @emilzo / DevFactoryAI). Ver CLA.md. Scores de estimativa. O relatório linha a linha é privado. Não entra no ranking enquanto não houver uma auditoria pública. |
| Claude Code, Codex CLI, Cursor, Cline, OpenClaw, claude-code-router, LangGraph, CrewAI | 🔶 Estimativa | avaliação informada, a validar por auditoria |

## Como ler os resultados

- **HCI**: maturidade arquitetural a partir de código e evidência, em 22 dimensões. Não é um benchmark de desempenho em tarefas.
- **Auditado**: auditoria humana do código com evidência `path:line` publicada.
- **Preliminar**: análise heurística feita no browser; é um primeiro corte, não uma auditoria completa.
- **Estimativa**: avaliação informada sem relatório de auditoria publicado e verificável de forma independente.
- **Local**: adicionado na tua sessão do browser. Não passa a fazer parte do dataset do projeto.
- **Benchmarked**: reservado a uma execução comportamental B1–B8 publicada e revista. É separado dos estados de proveniência do HCI acima.

## Como contribuir

Guia completo em [`CONTRIBUTING.md`](CONTRIBUTING.md) — inclui o **formulário público de submissão do teu harness** (via pública com badge AUDITADO ou entrada como estimativa), o [email para contacto privado](mailto:emilio.mina@gmail.com?subject=Auditoria%20privada%20Harness%20Compass), o [LinkedIn](https://www.linkedin.com/in/emiliomina/) para contacto comercial e o template de auditoria (`docs/audits/AUDIT-TEMPLATE.md`).

1. **Adicionar/afinar um harness**: edita o array `BUILTIN_HARNESSES` na secção DADOS (início do `<script>` de `index.html`). Cada entrada tem 22 scores (0–10), `audited: true/false`, tags e um blurb. Faz um PR.
2. **Auditar um harness a sério**: segue o método em `docs/` (taxonomia + escala + regras de evidência) e muda `audited` para `true` com os relatórios.
3. **Melhorar a base de conhecimento**: o mapa `IMPROVEMENT_PATTERNS` (recomendações por dimensão, com o mecanismo-fonte citado) cresce a cada auditoria. Cada padrão novo = um PR. É assim que os rankings e os conselhos ficam mais precisos e robustos.
4. **Melhorar o mapa ou o quiz**: PR bem-vindo.

**Regra de ouro do projeto:** dados auditados, preliminares e estimativas **nunca** se misturam sem etiqueta.

Uma auditoria interna ou privada pode informar uma **Estimativa**, mas não dá direito ao badge público **AUDITADO**. Esse badge exige evidência linha a linha publicada, para qualquer pessoa poder verificar.

## Integridade do ranking (como é que "a sério" funciona)

**Pergunta legítima: não pode alguém mexer nos pesos, guardar e rankear em primeiro?** Resposta: na sessão local de cada pessoa, sim e é irrelevante, porque o ranking *oficial* não vem dos browsers das pessoas. É assim que funciona:

1. **O ranking oficial vive no repo**: o array `HARNESSES` em `index.html`. Entra por **PR revisto**, não por download.
2. **O badge AUDITADO exige relatório**: evidência `path:line` real, como os que estão em `docs/`. Sem relatório, sem badge.
3. **Tudo o que adicionas localmente fica marcado LOCAL**: e qualquer ajuste manual aos sliders fica **visível**: contador de "⚠ N dimensões ajustadas" no badge, e o export JSON carrega a proveniência (`meta.heuristica` = o que a análise detetou vs o que tu mudaste).
4. **O princípio não é impedir a mentira, é torná-la visível.**: Quem abre o ranking vê imediatamente o que é verificado, o que é estimativa e o que foi mexido à mão.
5. **Confidencialidade a pedido de quem submete.**: Quem submete um harness para auditoria pode pedir que ele **não seja revelado publicamente**, a decisão é do submissor. Nesse caso a auditoria é privada: o relatório é entregue apenas ao submissor e o harness **não entra no ranking público**, porque o badge AUDITADO público exige evidência publicada (não há badge público com prova secreta. Seria exatamente a claim sem prova que este projeto denuncia). A via privada existe como serviço de consultoria e começa por [email](mailto:emilio.mina@gmail.com?subject=Auditoria%20privada%20Harness%20Compass), nunca num issue público. Não envies código privado antes de combinarmos uma forma segura de transferência. A via pública dá o badge e o lugar no ranking.

**Fluxo honesto para rankear um harness:**
1. Audita a pasta → badge Preliminar (só com justificações da análise)
2. Ajusta o que quiseres → fica marcado (divergência visível)
3. Auditoria completa com relatório → submete via PR → badge Auditado oficial
4. O harness entra no ranking do projeto para toda a gente, com a prova junta.

## Ciclo de melhoria contínua (como o Compass fica mais esperto)

1. **Auditoria local** (badge Preliminar) → primeiro corte em minutos.
2. **Plano de melhoria** → o Compass aponta os gaps (dimensões < 6) com padrões provados e níveis de maturidade L1–L5 ("o que falta, o que fazer").
3. **Auditoria completa** (badge Auditado) → scores definitivos com evidência.
4. **Recalibração** → cada par (heurística vs auditada) pode ser comparado. Uma nota anterior afirmava um erro médio de cerca de 1,6 por dimensão contra o Hermes. Esse número não tem fonte pública e foi retirado. A heurística não está calibrada contra uma tabela de erro publicada.
5. **Base de conhecimento** → cada padrão novo entra no `IMPROVEMENT_PATTERNS` e beneficia todos os harnesses futuros.

## Método

- **Taxonomia:** 6 domínios × 22 dimensões (A Núcleo · B Guias · C Sensores · D Governação ★ · E Aprendizagem · F Operacional).
- **Escala 0–10 por dimensão (rubrica v1):** 0 = não existe (provado) · 2 = vestígio · 4 = caso simples · 6 = integrado com gaps · 8 = sólido com testes · 9 = alto, e em uso (Hermes Agent A2, C1, F3; T3 Code C1, C3) · 10 = fronteira por cumprir (invariantes verificados formalmente, aprendizagem com resultados medidos, uma execução B1–B8 revista, optimalidade de custo contra uma linha de base). O HCI exibe a média ×10 (0–100). O melhor HCI atual é 75. Re-norming futuro é versionado (v2), nunca silencioso. Ver `references/harness-map.md`.
- **Evidência:** auditorias read-only; cada afirmação cita `path:line` verificado; ausências provadas por busca; cobertura declarada.
- **Foco obrigatório:** domínio D. Governança, julgamento, compliance, guardrails.

## Estudos de caso

- `docs/DEEP-HARNESS-AUDIT-HERMES.md` Deep audit linha-a-linha do Hermes, **publicado integralmente** (15 achados, KPIs, 15 padrões portáveis, 10 recomendações), revisão de arquitetura de um projeto open-source, publicada como cortesia e como prova do método. A [tradução inglesa integral](docs/DEEP-HARNESS-AUDIT-HERMES.en.md) também está publicada.
- `docs/EVIDENCE-SUMMARY-KANDO.md` sumário público de uma revisão privada. O Kando é construído pelo autor do Harness Compass (DevFactoryAI). Não está no ranking. Cada `path:line` desse sumário é não verificável (fonte privada).

## Divulgação

O Kando é construído pelo autor do Harness Compass (Emílio, @emilzo / DevFactoryAI). Ver `CLA.md`. Não entra no ranking enquanto não houver uma auditoria pública. Os padrões do plano de melhoria que citam ficheiros do Kando estão marcados como não verificáveis (fonte privada).

## Pressupostos do modelo de custo

Os coeficientes 0,7 (cache), 0,5 (falhas evitadas), 0,45 (compressão) e 0,65 (routing) não têm medição publicada. São pressupostos. A cache aplica-se depois da compressão. A compressão reduz o volume enviado. A cache divide depois esse volume em leituras em cache e input sem cache. As duas taxas são tratadas como independentes. Isso também é um pressuposto. As leituras em cache custam 0,1 vezes o preço de input, o fator que a Anthropic publica para leituras de prompt cache (https://platform.claude.com/docs/en/build-with-claude/prompt-caching). Não é uma fatura medida destes harnesses. Prémios de escrita em cache não são modelados. Volumes por omissão: 200 milhões de tokens de input e 20 milhões de tokens de output por mês. Preços por omissão: $0,14 e $0,42 (económico) e $3 e $15 (premium) por milhão de tokens. Os modelos não estão nomeados e os preços não estão datados. Os controlos da calculadora começam em 55/25/30/70. Também são pressupostos. O routing é `0,65 × A1/10`. Um score 0 não encaminha nada. Os tetos `min()` em `harnessEff` não mudaram (0,85, 0,60, 0,60, 0,95) e não são atingidos pelos coeficientes atuais. As taxas atingíveis são cache até 70%, falhas evitadas até 50%, compressão até 45%, routing de 0% a 65%. O custo por tarefa medido está planeado no cenário B8 e não está implementado.

## Licença e integridade

**Licença: AGPL-3.0** O código é aberto, mas quem fornecer uma versão derivada como serviço (SaaS) é obrigado a publicar o código-fonte. Isto protege o projeto contra forks que o revendam fechado.

**O que é público vs retido:** o código, a taxonomia e as auditorias publicadas são a prova e o ímã. O **dataset vivo** (auditorias novas, telemetria agregada, scores em evolução) e o **selo de auditoria certificada** são ativos do projeto que não se forkiam — o que se publica hoje determina o que se pode vender amanhã.

## Internacionalização (i18n)

Seletor de idioma no topo. **Inglês é a norma**, com Português, Francês, Alemão, Mandarim e Hindi. O dicionário vive no topo do `index.html` (`const T = {...}`). Uma etiqueta em falta noutra língua cai para Inglês. Uma afirmação anterior de que as seis línguas estavam completas a 330 chaves estava errada. Não fixes aqui uma contagem de chaves. Corre `node check-i18n.js`. **Para adicionar uma língua nova:** copia o bloco `pt:{...}`, traduz os valores e atualiza o seletor `LANGUAGES`.

**Tema claro/escuro:** botão ☀️/🌙 no topo, respeita a preferência do sistema na primeira visita e lembra a tua escolha (localStorage).

## Constância de modelos (preços sempre atuais)

- **Fonte viva:** a lista de modelos vem do OpenRouter a cada carregamento da app quando um provider fecha um modelo, ele desaparece automaticamente do seletor; os novos aparecem no mesmo dia.
- **Diff local:** a app guarda um snapshot no teu browser e mostra o que mudou desde a última visita ("🆕 N novos · 📦 M saíram desde …").
- **Histórico local de descontinuados:** os modelos que saem ficam registados (nome, data, último preço) numa lista colapsável, útil para proveniência de pricing e continuidade de auditorias.
- **Snapshot commitado:** `docs/models/latest.json` no git continua a ser o ficheiro commitado em 2026-08-09 (378 modelos). `.github/workflows/models-snapshot.yml` corre todos os dias e executa `scripts/snapshot-models.mjs`. Quando `docs/models/latest.json` ou `docs/models/history.json` mudam, abre ou atualiza um pull request do branch `models-snapshot` para `main`. Não faz push para `main`. O agendamento usa o ficheiro de workflow em `main`, por isso isto começa depois de este branch ser integrado. Depois de criar ou atualizar, o mesmo workflow corre `gh workflow run ci.yml --ref models-snapshot` com o `GITHUB_TOKEN` por omissão. Isso precisa de `actions: write`, e o `workflow_dispatch` em `ci.yml` tem de estar em `main` antes de o comando poder iniciar uma execução. O nome do job continua a ser `test`. A documentação do GitHub diz que um check de `workflow_dispatch` não aparece no pull request e não satisfaz um status check obrigatório numa ruleset de branch. Os eventos que contam são `push`, `pull_request`, `pull_request_review`, `pull_request_target`, `deployment` e `deployment_status`. A execução de `pull_request` criada pelo token por omissão continua à espera de uma pessoa com acesso de escrita a aprovar. O auto-merge não está ligado, por isso esse pull request é integrado à mão. A página continua a carregar a lista viva do OpenRouter no browser.

## Garantia i18n (norma obrigatória)

`node check-i18n.js` valida (exit 1 se falhar):
- [x] Chaves em **EN e PT** para qualquer funcionalidade nova (as outras línguas reportam fallback)
- [x] Chaves **table-driven** (`dim_*`, `imp_*`, `quiz_*`, `lv_*`, `blurb_*`, `dom_*`) as ~160 chaves que chegam ao `t()` por variável
- [x] `t("chave")` literal (aspas duplas, simples ou template) sem chave em EN
- [x] **Placeholders `{x}` consistentes** entre EN e cada língua (um typo `{N}` vs `{n}` falha)
- [x] Chaves órfãs (existem numa língua mas não em EN) e duplicadas no mesmo bloco
- [x] Línguas declaradas em `LANGUAGES` vs blocos do dicionário (nenhuma língua fica invisível ao check)
- [x] Interpolação em atributos HTML (`value`/`title`/`placeholder`/…) **sem `esc()`** em qualquer posição do valor (injeção latente)
- [x] Interpolações de conteúdo fora da allowlist auditada (aviso; zero avisos em árvore limpa)

## Testes (automatizados + smoke manual)

**`npm test`** corre o `check-i18n.js` e a suite de regressão jsdom (`test/regression.mjs`). Cobre o quiz e a auditoria na troca de língua, reset/cancel, o matcher, a cache, a reentrância do picker, os widgets OpenRouter, o CTA da home, os canais de contacto, as pills, as variáveis de tema nos SVG, a navegação por teclado, a regra de evidência publicada para entradas auditadas, a fórmula de custo modelado e o ranking por omissão só com auditados. O CI (`.github/workflows/ci.yml`) corre isto em **cada push/PR**.

Smoke manual recomendado antes de um release (Chrome, `python -m http.server 8123`):

1. **Temas:** em claro e escuro, badges, chips A–F, avisos, pills, donut e radar legíveis.
2. **Offline/CORS:** com a rede cortada, a vista de Custo mostra o aviso de preços manuais e continua a funcionar.
3. **Fallback do picker:** em Firefox (sem `showDirectoryPicker`) a auditoria funciona pelo seletor clássico; cancelar mostra "Cancelado." de imediato.

Depois de passar: `npm test` verde → commit.
