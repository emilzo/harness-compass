# Harness Compass — Roadmap

Legenda: `[x]` = feito e verificado · `[ ]` = por fazer
Última atualização: 2026-08-10 · Estado do código: suite de regressão 22/22 verde · `check-i18n` exit 0 · Lighthouse 98/100/100/100

## Fase 0 — Fundação ✅
- [x] App single-file, funciona offline (`index.html`; jsdom só como devDependency de testes)
- [x] Taxonomia 6 domínios × 22 dimensões (`references/harness-map.md`)
- [x] Ranking com scores, HCI (Harness Compass Index) e badges de proveniência
- [x] Mapa da taxonomia (vista interativa A–F)
- [x] Quiz de recomendação ponderada
- [x] Calculadora de custo + vista "Same Model, Different Harness" (custo harness-adjusted)
- [x] Preços reais do OpenRouter em runtime (sem credenciais, CORS-friendly)
- [x] Auditoria local no browser: lê até 300 ficheiros da pasta, 100% local, sem upload
- [x] Export JSON com heurística original + contador de dimensões ajustadas
- [x] Licença AGPL-3.0 + README completo

## Fase 1 — Globalização ✅
- [x] i18n EN + PT completos
- [x] i18n FR/DE/ZH/HI **completos** — 329 chaves por língua, 6 línguas a 329/329 (fim do fallback EN visível)
- [x] Selector de 6 línguas + persistência (localStorage) + fallback EN automático
- [x] `check-i18n.js` como norma obrigatória — chaves EN **e PT** (exit 1 se faltarem), chaves table-driven (dim/imp/quiz/lv/blurb/dom), placeholders consistentes entre línguas, órfãs, duplicados, `LANGUAGES` vs blocos do dicionário, `esc()` em atributos, allowlist de conteúdo com zero avisos
- [x] Tema claro/escuro com persistência e contraste corrigido (incl. donut/radar com variáveis de tema)
- [x] Branding: `@emilzo` público (rodapé) · `@eluminaime · @emilzo · Agent Hermes (Tom)` interno

## Fase 2 — Constância, Integridade & Endurecimento ✅
- [x] Snapshot local + diff de modelos (🆕 novos / 📦 saíram desde a última visita)
- [x] Histórico local de modelos descontinuados (nome, data, último preço)
- [x] `scripts/snapshot-models.mjs` + workflow GitHub Actions (cron diário)
- [x] Dataset `docs/models/` (378 modelos reais com preços — primeiro snapshot)
- [x] Revisões externas fechadas: 15 findings + 6 novos (N1–N6) + triple check final de 21 findings — todos corrigidos com verificação
- [x] Suite de regressão jsdom — **22 cenários** (quiz, replay de língua, auditoria, cache, picker, re-entrância, widgets OpenRouter, CTA, pills, tema dos SVG, teclado, status re-traduzível)
- [x] CI (`.github/workflows/ci.yml`): `npm test` (check-i18n + suite) em cada push/PR
- [x] Privacidade verificada: Limpar liberta cache/meta/closures (~2 MB); re-entrância do picker segura
- [x] Acessibilidade: landmark `main`, aria-labels, teclado nas tabelas, `prefers-reduced-motion` (CSS + JS), labels `for=` — Lighthouse A11y 100
- [x] SEO/social: meta description, Open Graph + Twitter Card, social card 1200×630, favicon, theme-color dinâmico
- [ ] Snapshot global a correr diariamente — o workflow está pronto, só corre depois do push

## Fase 3 — Publicação 🚧 (bloqueada apenas pelo push do @emilzo)
- [x] **Decisão de evidência (P0 do review externo) — resolvida:** relatório do Hermes **publicado integralmente** (`docs/DEEP-HARNESS-AUDIT-HERMES.md`, edição pública com paths locais normalizados + nota de cortesia OSS) · Kando com **sumário de evidência** (`docs/EVIDENCE-SUMMARY-KANDO.md`; relatório completo interno — produto comercial em desenvolvimento final)
- [x] Campo `evidence` nos harnesses `audited:true` — o texto "Auditoria com evidência path:line" no detail é agora um link para o relatório
- [x] **Política de confidencialidade de submissões** (README §Integridade 5 + BENCHMARK-SPEC §5): quem submete pode pedir auditoria privada — relatório só para o submissor e fora do ranking/leaderboard público; badge público exige evidência publicada
- [ ] Decidir se `launch-assets/` (16 screenshots, ~2 MB) entra no git — hoje é deliberadamente local; se o marketing partir do repo público, versionar
- [ ] Repo no GitHub + push (gh autenticado como `@emilzo`) — **17+ commits prontos em `main`**
- [ ] GitHub Pages ativo (a app fica pública; OpenRouter volta a carregar preços reais em HTTPS)
- [ ] Confirmar/ajustar `og:url`/`og:image` se o URL do Pages não for `emilzo.github.io/harness-compass`
- [ ] Gate 2: checklist do README corrida na URL pública + workflows verdes
- [x] Assets de lançamento: 16 screenshots (8 vistas × 2 temas, atualizados pós-correções) em `launch-assets/` + social card em `docs/social-card.png`
- [ ] Artigo-âncora EN (Show HN + blog)
- [ ] Landing curta como funil — o Compass serve de produto-âncora; landing formal separada ainda não existe

## Fase 3.5 — Estrutura (depois do lançamento, nunca na véspera)
- [ ] Partir o monólito sem build: `index.html` + `assets/data.js` + `assets/i18n.js` + `assets/app.js` (`file://` continua a funcionar; suite adapta com `JSDOM.fromFile`)
- [x] **Funil de submissão pré-lançamento** (antecipado da 3.5 — o visitante que audita o próprio repo tem caminho a seguir ao Export):
  - [x] `CONTRIBUTING.md` com as 3 vias (auditoria pública → AUDITADO · privada confidencial · estimativa via PR)
  - [x] `docs/audits/AUDIT-TEMPLATE.md` (22 dims, evidência `path:line`, cobertura declarada, escolha pública/privada)
  - [x] Issue form "Submit your harness" (`.github/ISSUE_TEMPLATE/submit-harness.yml`) + PR template com checklist de integridade
  - [x] Dica de submissão no cartão de auditoria (au_submit, 6 línguas) a apontar para o issue form
  - [x] Teste 23 na suite: todo o `audited:true` TEM `evidence` e o ficheiro existe (regra vira gate de CI)
- [x] **Pipeline de auditoria semi-automático** (`.claude/skills/audit-harness` + `.claude/workflows/audit-harness.js`): submissão → clone/pin SHA → 6 domínios em paralelo → consolidação no template → verificação adversarial das citações → draft; o humano só faz o **sign-off de 15–30 min** (spot-check de ≥3 citações + aprovação, agrupável em lote) — o gate humano nunca é removido
- [ ] (opcional, UI) botão "Preparar submissão" na auditoria local: descarrega JSON preliminar + template pré-preenchido, sempre `audited:false`
- [ ] JSON schema formal do harness

## Fase 4 — Credibilidade & Benchmark 🚧
- [ ] Runner dos cenários B1–B8 (Python standalone — ver `BENCHMARK-SPEC.md`; ainda não existe)
- [ ] Leaderboard B1–B8 com submissões reais
- [ ] Primeira auditoria externa via PR (o pipeline existe; o fluxo externo ainda não foi exercitado)
- [ ] Selo AUDITED + termos de submissão formais
- [ ] Termos legais: proteção da marca, retenção de dados, consentimento de telemetria

## Fase 5 — Tração & Receita 🚧
- [ ] Canais técnicos: Hacker News, Reddit, dev.to
- [ ] Canais empresariais: LinkedIn, Substack
- [ ] Primeira consulta gratuita (30–45 min) como funil de diagnóstico
- [ ] Plano pago: otimização de custo / implementação / auditoria / monitorização
- [ ] Continuidade temporal completa: resultados publicados ligados à versão exacta do modelo

## Gatilhos futuros (decidir quando acontecerem, não antes)
- [ ] **Escala do ranking** — gatilho ~30-50 entradas: pesquisa + paginação na tabela e tiers em vistas próprias (Auditados/Benchmarked/Estimativas). Nota de arquitetura: a auditoria local é privada e efémera (memória da sessão, sem upload) — o ranking partilhado SÓ cresce pelo pipeline editorial, por isso "milhares de linhas" não acontecem por acidente
- [ ] **Política de notabilidade escrita** — gatilho: fila de submissões > capacidade de sign-off. O ranking é um benchmark curado, não um diretório: entra quem tem uso real/vendor identificável/projeto vivo; o resto fica em auditoria local ou estimativa não listada. A banalização de scores empatados desempata-se com o B1–B8 (comportamento), não com mais linhas
- [ ] Dados como dados (`data/harnesses/*.json`, `locales/*.json`) — gatilho: primeira contribuição externa real
- [ ] Migração Vite + TypeScript + render-a-partir-de-estado — gatilho: leaderboard/crescimento da equipa
- [ ] Decisão de produto: `harnessEff` com caps atingíveis na fórmula (hoje o texto declara os tetos reais: cache ≤70%, falhas ≤50%, compressão ≤45%, routing 30–95%)

## Registado sem correção (menores, documentados nas revisões)
- `md_stable` mostra a data da última visita, não o início real da estabilidade
- Poupança negativa na calculadora sem aviso (inputs invertidos; é ilustrativa)
- "+ Adicionar ao ranking" repetido cria entradas locais duplicadas (por design)
- `applyI18n` corre até 3× por troca de língua (perf micro; sem impacto visível)
