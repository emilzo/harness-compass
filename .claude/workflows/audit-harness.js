export const meta = {
  name: 'audit-harness',
  description: 'Auditoria profunda de um harness (22 dimensões): 6 domínios em paralelo → consolidação no template → verificação adversarial de citações → draft pronto para sign-off humano',
  whenToUse: 'Quando há uma submissão de harness para auditar (via pública ou privada). O checkout local já deve existir com SHA fixado.',
  phases: [
    { title: 'Domínios', detail: '6 agentes read-only em paralelo (A–F), evidência path:line obrigatória' },
    { title: 'Consolidação', detail: 'relatório no formato docs/audits/AUDIT-TEMPLATE.md + scores' },
    { title: 'Verificação', detail: 'as citações-chave confirmadas adversarialmente por agentes independentes' },
  ],
}

const { path: TARGET, sha = 'NÃO FIXADO — fixar antes do sign-off', name = 'harness', repoUrl = '' } = args || {};
if (!TARGET) throw new Error('args.path obrigatório: caminho local do checkout a auditar (com SHA fixado)');

const SCALE = 'Escala: 0=não existe (provado por busca) · 2=vestígio/stub · 4=funciona no caso simples · 6=funcional e integrado, gaps conhecidos · 8=sólido, erros tratados, testes · 10=razão de existir';

const DOMAINS = [
  ['A', 'Núcleo & Interface', 'A1 Multi-model & routing (providers, fallback, failover) · A2 Prompts & contexto (system prompt, caching, compressão, context files) · A3 Agent loop & orquestração (loop, subagentes, scheduling) · A4 Tools & extensibilidade (registry, toolsets, MCP, plugins)'],
  ['B', 'Guias feedforward', 'B1 Especificação de intenção (plans, briefs, tarefas) · B2 Skills & playbooks (conhecimento procedural, curadoria) · B3 Convenções de projeto (AGENTS.md, CLAUDE.md, .cursorrules) · B4 Políticas declaradas (restrições explícitas e testáveis)'],
  ['C', 'Sensores feedback', 'C1 Testes & verificação (suites, CI, linters) · C2 Avaliação (evals, LLM-as-judge, benchmarks, drift) · C3 Observabilidade (logs, traces, métricas, erros) · C4 Auto-correção (retry, circuit breakers, fix loops)'],
  ['D', 'Governação, Julgamento & Guardrails ★', 'D1 Guardrails de segurança (anti-injection, scanning, validação) · D2 Permissões & sandboxing (approvals, least privilege) · D3 Julgamento & escalação (decide sozinho vs humano, thresholds) · D4 Compliance & legal (auditoria, retenção, GDPR) · D5 Ética & alinhamento (disclosure, fairness, limitações)'],
  ['E', 'Ciclo de vida & aprendizagem', 'E1 Memória & aprendizagem (persistência, anti-promptware) · E2 Steering loop humano (como o humano itera no harness)'],
  ['F', 'Operacional', 'F1 Execução & ambientes (local, docker, cloud) · F2 Custo & eficiência (cap, budgets, rate limiting) · F3 Resiliência (failover, timeouts, crash recovery)'],
];

const DOMAIN_SCHEMA = {
  type: 'object', required: ['dimensions', 'coverage'], additionalProperties: false,
  properties: {
    dimensions: { type: 'array', items: { type: 'object', required: ['id', 'score', 'mechanisms', 'weaknesses'], additionalProperties: false, properties: {
      id: { type: 'string' }, score: { type: 'number' },
      mechanisms: { type: 'array', items: { type: 'object', required: ['claim', 'cite'], additionalProperties: false, properties: { claim: { type: 'string' }, cite: { type: 'string', description: 'path:linhas REAL que abriste, ex. src/loop.py:120-145' } } } },
      weaknesses: { type: 'array', items: { type: 'object', required: ['claim', 'cite'], additionalProperties: false, properties: { claim: { type: 'string' }, cite: { type: 'string', description: 'path:linha ou "grep X → 0" para ausências provadas' } } } },
      not_verified: { type: 'array', items: { type: 'string' } },
    } } },
    coverage: { type: 'array', items: { type: 'object', required: ['area', 'read'], additionalProperties: false, properties: { area: { type: 'string' }, read: { type: 'string', description: 'INTEGRAL / janelas / só greps / não lido + %' } } } },
  },
};

phase('Domínios');
const reads = await parallel(DOMAINS.map(([id, title, dims]) => () =>
  agent(`Auditoria READ-ONLY do domínio ${id} (${title}) do harness "${name}" no checkout local ${TARGET}.
Dimensões a pontuar: ${dims}
${SCALE}
REGRAS NÃO-NEGOCIÁVEIS (o sign-off humano rejeita violações):
- Nada é executado nem alterado; só leitura, grep e contagens.
- Cada mecanismo citado tem path:linha REAL de um ficheiro que ABRISTE (não inferido de nomes).
- Ausências são evidência quando provadas: cita o comando ("grep -r llm_as_judge → 0").
- O que não leste vai para not_verified — um mecanismo não lido NÃO pontua.
- Declara a cobertura por área com honestidade (INTEGRAL / janelas / só greps / 0%).
Devolve APENAS o objeto estruturado.`,
    { label: `dom:${id}`, phase: 'Domínios', schema: DOMAIN_SCHEMA })));

const domains = reads.filter(Boolean);
if (domains.length < DOMAINS.length) log(`⚠ ${DOMAINS.length - domains.length} domínio(s) sem resultado — o draft declara o buraco`);

phase('Consolidação');
const CONSOL_SCHEMA = { type: 'object', required: ['file', 'scores', 'hci', 'topClaims'], additionalProperties: false, properties: {
  file: { type: 'string' }, scores: { type: 'object', additionalProperties: { type: 'number' } }, hci: { type: 'number' },
  topClaims: { type: 'array', items: { type: 'object', required: ['claim', 'cite'], additionalProperties: false, properties: { claim: { type: 'string' }, cite: { type: 'string' } } }, description: 'as 12 citações mais determinantes para os scores' },
} };
const draft = await agent(`Consolida estas 6 auditorias de domínio num relatório markdown EXATAMENTE no formato de docs/audits/AUDIT-TEMPLATE.md (lê o template primeiro) e escreve-o em docs/audits/DRAFT-${name}.md do repo harness-compass.
Cabeçalho: alvo ${repoUrl || TARGET} @ commit ${sha}; modo read-only. Mantém TODOS os not_verified e a cobertura declarada (secção Limitações honesta).
No fim do ficheiro acrescenta a secção "## SIGN-OFF (humano)" com: (1) tabela dos 22 scores para aprovação; (2) as 12 citações-chave com caixa [ ] cada; (3) instrução: verificar manualmente pelo menos 3, aprovar scores, apagar esta secção, renomear DRAFT-→<nome>.md.
Dados dos domínios: ${JSON.stringify(domains)}
Devolve {file, scores (os 22), hci, topClaims (12 citações mais determinantes)}.`,
  { label: 'consolidar', phase: 'Consolidação', schema: CONSOL_SCHEMA });

phase('Verificação');
const VERIFY_SCHEMA = { type: 'array', items: { type: 'object', required: ['cite', 'verdict', 'note'], additionalProperties: false, properties: {
  cite: { type: 'string' }, verdict: { type: 'string', enum: ['CONFIRMED', 'REFUTED', 'NOT_FOUND'] }, note: { type: 'string' } } } };
const chunks = [];
for (let i = 0; i < draft.topClaims.length; i += 3) chunks.push(draft.topClaims.slice(i, i + 3));
const verification = (await parallel(chunks.map((claims, i) => () =>
  agent(`Verificação ADVERSARIAL no checkout ${TARGET}: para cada citação, ABRE o ficheiro nas linhas citadas e decide se o mecanismo descrito está mesmo lá. Default REFUTED em caso de dúvida; NOT_FOUND se o path/linhas não existem. Citações: ${JSON.stringify(claims)}`,
    { label: `verify:${i + 1}`, phase: 'Verificação', schema: VERIFY_SCHEMA })))).filter(Boolean).flat();

const refuted = verification.filter(v => v.verdict !== 'CONFIRMED');
if (refuted.length) log(`⚠ ${refuted.length} citação(ões) não confirmadas — corrigir no draft ANTES do sign-off`);

return { draft: draft.file, scores: draft.scores, hci: draft.hci, verification, refutedCount: refuted.length };
