# Harness Compass — Roadmap

Legenda: `[x]` = feito · `[ ]` = por fazer · **Nota:** = parcial (caixa em branco)
Última atualização: 2026-08-09

## Fase 0 — Fundação ✅
- [x] App single-file, zero dependências, funciona offline (`index.html`)
- [x] Taxonomia 6 domínios × 22 dimensões (`references/harness-map.md`)
- [x] Ranking com scores, HCI (Harness Compass Index) e badges de proveniência
- [x] Mapa da taxonomia (vista interativa A–F)
- [x] Quiz de recomendação ponderada
- [x] Calculadora de custo + vista "Same Model, Different Harness" (custo harness-adjusted)
- [x] Preços reais do OpenRouter em runtime (sem credenciais, CORS-friendly)
- [x] Auditoria local no browser: lê até 300 ficheiros da pasta, 100% local, sem upload
- [x] Export JSON com heurística original + contador de dimensões ajustadas
- [x] Licença AGPL-3.0 + README completo

## Fase 1 — Globalização ✅ (uma parcial)
- [x] i18n EN + PT completos (322 chaves: blurbs, dimensões, padrões, método, quiz, auditoria)
- [ ] i18n FR/DE/ZH/HI completos — **Nota:** 289 chaves por língua em fallback EN (navegação, títulos e badges traduzidos; conteúdo longo ainda cai em EN)
- [x] Selector de 6 línguas + persistência (localStorage) + fallback EN automático
- [x] `check-i18n.js` como norma obrigatória: chaves EN, `esc()` em atributos, `data-i18n` órfãos
- [x] Tema claro/escuro com persistência e contraste corrigido (ámbar, pills, chips, notices)
- [x] Branding: `@emilzo` público (rodapé) · `@eluminaime · @emilzo · Agent Hermes (Tom)` interno

## Fase 2 — Constância & Integridade ✅ (uma parcial)
- [x] Snapshot local + diff de modelos (🆕 novos / 📦 saíram desde a última visita)
- [x] Histórico local de modelos descontinuados (nome, data, último preço)
- [x] `scripts/snapshot-models.mjs` + workflow GitHub Actions (cron diário)
- [x] Dataset `docs/models/` (378 modelos reais com preços — primeiro snapshot)
- [ ] Snapshot global a correr diariamente — **Nota:** o workflow está pronto, mas só corre depois do push para GitHub
- [x] Review externo: 12 findings corrigidos + 2 refutados com evidência
- [x] Prevenção de regressões: `setLang` refatorado, estado com teardown, cache da análise
- [x] Checklist de testes manuais obrigatórios no README

## Fase 3 — Publicação 🚧 (pronta, por executar)
- [ ] Repo no GitHub + push (gh autenticado como `@emilzo`)
- [ ] GitHub Pages ativo (a app fica pública e o OpenRouter volta a carregar preços reais)
- [ ] Snapshot global de modelos a correr (depende do push)
- [ ] Artigo-âncora EN (Show HN + blog)
- [ ] Landing curta como funil — **Nota:** o Compass serve de produto-âncora; landing formal separada ainda não existe
- [ ] Assets de lançamento (screenshots, demo gravada, social cards)

## Fase 4 — Credibilidade & Benchmark 🚧
- [ ] Leaderboard B1–B8 com submissões reais — **Nota:** a especificação `BENCHMARK-SPEC.md` está completa; nenhuma submissão protocolada ainda
- [ ] Primeira auditoria externa via PR (o pipeline existe: relatório + evidência → badge AUDITADO; Hermes/Kando/CCR já têm badges builtin, mas o fluxo externo ainda não foi exercitado)
- [ ] Selo AUDITED + termos de submissão formais
- [ ] Termos legais: proteção da marca, retenção de dados, consentimento de telemetria

## Fase 5 — Tração & Receita 🚧
- [ ] Canais técnicos: Hacker News, Reddit, dev.to
- [ ] Canais empresariais: LinkedIn, Substack
- [ ] Primeira consulta gratuita (30–45 min) como funil de diagnóstico
- [ ] Plano pago: otimização de custo / implementação / auditoria / monitorização
- [ ] Continuidade temporal completa: resultados publicados ligados à versão exacta do modelo (benchmarks antigos preservados quando um modelo é retirado)
