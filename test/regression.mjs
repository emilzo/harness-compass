/**
 * Suite de regressão do Harness Compass (jsdom) — cobre os cenários que falharam
 * nas revisões externas (15 findings + re-análises N1-N6/F3/F7/F13).
 *
 * Regra: se um teste falhar, NÃO "corrigir" a app — o diagnóstico vai para o relatório.
 * Os testes são a rede de segurança; o código da app é a fonte de verdade.
 *
 * Correr: npm test   (check-i18n.js + node --test test/)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

/** Boot de um DOM isolado por teste. O script da app corre (runScripts:dangerously).
 *  opts.fetch: stub de window.fetch (o loadOpenRouter preenche a binding lexical
 *  __ormodels e window.__orStatus via o caminho real). Sem stub, o fetch é undefined
 *  no jsdom → loadOpenRouter cai em "offline" (comportamento real offline). */
function boot(opts = {}) {
  let scrollCalls = 0;
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      // jsdom não implementa matchMedia nem scrollIntoView
      window.matchMedia = window.matchMedia || (q => ({
        matches: false, media: q,
        addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {},
        dispatchEvent() { return false; },
      }));
      window.HTMLElement.prototype.scrollIntoView = function () { scrollCalls++; };
      if (opts.fetch) window.fetch = opts.fetch;
    },
  });
  return {
    dom,
    w: dom.window,
    scrollCalls: () => scrollCalls,
    $: sel => dom.window.document.querySelector(sel),
    $$: sel => [...dom.window.document.querySelectorAll(sel)],
  };
}

/** Garante fecho do DOM (limpa timers do jsdom, ex: o fallback de 90s do viaInput). */
async function withBoot(fn) {
  const t = boot();
  try { await fn(t); } finally { t.dom.window.close(); }
}

/** Entries falsas que representam um repo com sinais reais (case-sensitive). */
function fakeEntries() {
  return [
    { name: 'AGENTS.md', path: '/repo/AGENTS.md', dir: false, content: '# AGENTS\nNever do X without approval.' },
    { name: 'CLAUDE.md', path: '/repo/CLAUDE.md', dir: false, content: '# CLAUDE\nFollow the conventions.' },
    { name: 'SKILL.md', path: '/repo/skills/SKILL.md', dir: false, content: '# Skill\nPlaybook for tasks.' },
    { name: 'src', path: '/repo/src', dir: true },
    { name: 'tools', path: '/repo/tools', dir: true },
    { name: 'tests', path: '/repo/tests', dir: true },
    { name: '.github', path: '/repo/.github', dir: true },
    { name: 'test_flow.py', path: '/repo/tests/test_flow.py', dir: false, content: 'import pytest' },
    { name: 'ci.yml', path: '/repo/.github/workflows/ci.yml', dir: false, content: 'on: push' },
  ];
}

/* =====================================================================
 * 1–2. Quiz: seleções preservadas ao mudar de língua
 * ===================================================================== */

test('1. quiz respondido SEM submeter: setLang preserva as seleções', async () => {
  await withBoot(({ w, $ }) => {
    const q0 = $('#qq-0');
    assert.ok(q0, 'buildQuiz corre no boot — selects existem');
    const last = String(q0.options.length - 1);
    q0.value = last;
    $('#qq-1').value = String($('#qq-1').options.length - 1);
    assert.notEqual(q0.value, '0', 'seleção ≠ default para o teste valer');
    w.setLang('pt');
    assert.equal($('#qq-0').value, last, 'seleção preservada (pré-submissão)');
    assert.equal($('#qq-1').value, String($('#qq-1').options.length - 1));
  });
});

test('2. quiz submetido: setLang preserva seleções e re-renderiza o resultado', async () => {
  await withBoot(({ w, $ }) => {
    const q0 = $('#qq-0');
    q0.value = String(q0.options.length - 1);
    $('#qq-1').value = String($('#qq-1').options.length - 1);
    w.runQuiz();
    const before = $('#quiz-result').innerHTML;
    assert.ok(before.length > 0, 'resultado preenchido após submeter');
    w.setLang('pt');
    assert.equal($('#qq-0').value, String($('#qq-0').options.length - 1), 'seleção preservada (submetido)');
    const after = $('#quiz-result').innerHTML;
    assert.ok(after.length > 0, 'resultado re-renderizado');
    assert.notEqual(after, before, 'resultado re-renderizado na língua nova');
  });
});

/* =====================================================================
 * 3–5. Auditoria: estado preservado no re-render de língua
 * ===================================================================== */

test('3. auditoria aberta: slider + campos editados preservados após setLang', async () => {
  await withBoot(({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    const slider = $('[data-dim="C1"]');
    assert.ok(slider, 'sliders renderizados');
    slider.value = '9';
    w.auditSlide(slider);
    $('#au-name').value = 'Meu Harness';
    $('#au-vendor').value = 'ACME';
    w.setLang('pt');
    assert.equal($('[data-out="C1"]').textContent, '9', 'slider preservado');
    assert.equal($('#au-name').value, 'Meu Harness', 'campo nome preservado');
    assert.equal($('#au-vendor').value, 'ACME', 'campo vendor preservado');
  });
});

test('4. tipo/blurb NÃO editados: defaults atualizam com a língua', async () => {
  await withBoot(({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    assert.ok($('#au-type').value.startsWith('Locally audited'), 'default EN');
    assert.ok($('#au-blurb').value.startsWith('Local heuristic analysis'), 'blurb EN');
    w.setLang('pt');
    assert.ok($('#au-type').value.startsWith('Projeto auditado'), 'default atualizado para PT');
    assert.ok($('#au-blurb').value.startsWith('Análise local heurística'), 'blurb atualizado para PT');
  });
});

test('5. plano de melhoria aberto: setLang re-gera na língua nova SEM scrollIntoView', async () => {
  await withBoot(({ w, $, scrollCalls }) => {
    w.showAuditResult(fakeEntries());
    w.previewPlan();
    assert.equal(scrollCalls(), 1, 'previewPlan faz scroll no clique real');
    const before = $('#au-plan-preview').innerHTML;
    assert.ok(before.length > 0);
    w.setLang('pt');
    assert.equal(scrollCalls(), 1, 'replay do plano NÃO faz scroll');
    const after = $('#au-plan-preview').innerHTML;
    assert.ok(after.length > 0, 'plano re-gerado');
    assert.notEqual(after, before, 'plano re-gerado na língua nova');
  });
});

/* =====================================================================
 * 6–8. Reset / cancel: nenhuma ressurreição de estado
 * ===================================================================== */

test('6. resetAudit: limpa todo o estado; setLang não ressuscita nada', async () => {
  await withBoot(({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    assert.ok(w.__auditEntries, 'estado presente antes do reset');
    w.resetAudit();
    assert.ok(w.__auditEntries == null, '__auditEntries limpo');
    assert.ok(w.__auditRoot == null, '__auditRoot limpo');
    assert.ok(w.__auditCache == null, '__auditCache limpo');
    assert.ok(w.__auditMeta == null, '__auditMeta limpo');
    assert.equal($('#audit-result').innerHTML, '', 'resultado vazio');
    w.setLang('pt');
    assert.ok(w.__auditEntries == null, 'nada ressuscita após setLang');
    assert.equal($('#audit-result').innerHTML, '');
  });
});

test('7. pickFolder com AbortError: estado anterior limpo + status au_cancel', async () => {
  await withBoot(async ({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    w.showDirectoryPicker = () => Promise.reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    await w.pickFolder();
    assert.ok($('#audit-status').innerHTML.includes('Cancelled.'), 'status = au_cancel (EN)');
    assert.ok(w.__auditEntries == null, 'estado anterior limpo no início do pickFolder');
    w.setLang('pt');
    assert.equal($('#audit-result').innerHTML, '', 'nada ressuscita');
  });
});

test('8. viaInput: cancel responde de imediato; onchange tardio não altera estado', async () => {
  await withBoot(async ({ w, $ }) => {
    w.showDirectoryPicker = undefined; // força o caminho viaInput
    const inp = $('#folder-input');
    inp.click = () => {}; // não abre diálogo real
    let resolved = false;
    const p = w.pickFolder().then(() => { resolved = true; });
    await new Promise(r => setTimeout(r, 0)); // deixa o pickFolder chegar ao viaInput
    inp.dispatchEvent(new w.Event('cancel'));
    await p;
    assert.ok(resolved, 'pickFolder resolve com o cancel');
    assert.ok($('#audit-status').innerHTML.includes('Cancelled.'), 'status au_cancel imediato');
    assert.ok(w.__auditRoot == null, '__auditRoot não setado pelo cancel');
    // onchange disparado DEPOIS do cancel (ficheiros a chegar tarde) — done=true bloqueia
    inp.onchange();
    await new Promise(r => setTimeout(r, 0));
    assert.ok(w.__auditRoot == null, 'onchange tardio não altera __auditRoot');
    assert.ok(w.__auditEntries == null, 'entries não populadas');
  });
});

/* =====================================================================
 * 9–10. Matcher: case-insensitive e diretórios excluídos
 * ===================================================================== */

test('9. matcher: AGENTS.md/CLAUDE.md/SKILL.md disparam score E evidência coerentes', async () => {
  await withBoot(({ w }) => {
    const r = w.analyzeEntries(fakeEntries());
    assert.ok(r.scores.B3 > 0, `B3 score>0 (got ${r.scores.B3})`);
    const whyB3 = JSON.stringify(r.reasons.B3);
    assert.ok(whyB3.includes('AGENTS.md'), 'evidência B3 lista AGENTS.md');
    assert.ok(whyB3.includes('CLAUDE.md'), 'evidência B3 lista CLAUDE.md');
    assert.ok(r.scores.B2 > 0, `B2 score>0 (got ${r.scores.B2})`);
    assert.ok(JSON.stringify(r.reasons.B2).includes('"skill"'), 'evidência B2 lista o padrão que casou com SKILL.md');
  });
});

test('10. matcher: diretórios tests/.github NÃO contam como testFiles/workflows', async () => {
  await withBoot(({ w }) => {
    const r = w.analyzeEntries(fakeEntries());
    assert.equal(r.testFiles, 1, 'só o test_flow.py conta (dir tests excluído)');
    assert.equal(r.workflows, 1, 'só o ci.yml conta (dir .github excluído)');
  });
});

/* =====================================================================
 * 11–12. Cache e idempotência de render
 * ===================================================================== */

test('11. cache não é envenenado por overrides (ov aplicado sobre cópia)', async () => {
  await withBoot(({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    const heur = w.__auditCache.result.scores.C1;
    assert.ok(heur !== undefined, 'cache populado no primeiro render');
    w.showAuditResult(fakeEntries(), { C1: 9 });
    assert.equal($('[data-out="C1"]').textContent, '9', 'override aplicado na UI');
    assert.equal(w.__auditCache.result.scores.C1, heur, 'cache mantém o valor heurístico original');
  });
});

test('12. renderRanking + applyI18n: #rank-count continua preenchido', async () => {
  await withBoot(({ w, $ }) => {
    const el = $('#rank-count');
    assert.ok(el.innerHTML.trim().length > 0, 'preenchido no boot');
    const before = el.innerHTML;
    w.applyI18n();
    assert.equal($('#rank-count').innerHTML, before, 'applyI18n idempotente — não apaga o contador');
  });
});

/* =====================================================================
 * 13–15. Primeiro render traduzido, widgets OpenRouter, língua inválida
 * ===================================================================== */

test('13. sessão EN: primeiro render da auditoria tem labels em inglês', async () => {
  await withBoot(({ w, $ }) => {
    w.showAuditResult(fakeEntries());
    assert.equal($('label[data-i18n="au_name"]').innerHTML, 'Harness name');
    assert.equal($('#au-type').value, 'Locally audited project');
  });
});

test('14. widgets OpenRouter: loadOpenRouter real + renderORWidgets traduz com setLang e preserva o modelo', async () => {
  // fetch stubado: o loadOpenRouter do boot preenche __ormodels (binding lexical) e __orStatus
  const t = boot({
    fetch: () => Promise.resolve({
      ok: true,
      json: async () => ({ data: [
        { id: 'model-a', pricing: { prompt: 0.5, completion: 1.5 } },
        { id: 'model-b', pricing: { prompt: 1, completion: 2 } },
      ] }),
    }),
  });
  try {
    const W = t.w;
    await new Promise(r => setTimeout(r, 0)); // deixa o loadOpenRouter (async) terminar
    assert.equal(W.__orStatus, 'loaded', 'loadOpenRouter preencheu o estado');
    W.__orDiff = { hadSnap: true, added: 1, gone: 0, prevDate: '2026-08-01', count: 2 };
    W.renderORWidgets();
    const sel = t.$('#ct-model');
    assert.ok(sel.options.length >= 3, `opção vazia + 2 modelos (options=${sel.options.length})`);
    sel.value = 'model-b';
    assert.ok(t.$('#ct-or-status').innerHTML.includes('real prices'), 'status EN');
    assert.ok(t.$('#ct-models-diff').innerHTML.includes('new'), 'diff EN');
    W.setLang('pt');
    assert.equal(t.$('#ct-model').value, 'model-b', 'modelo escolhido preservado');
    assert.ok(t.$('#ct-or-status').innerHTML.includes('preços reais'), 'status re-renderizado em PT');
    assert.ok(t.$('#ct-models-diff').innerHTML.includes('novos'), 'diff re-renderizado em PT');
  } finally {
    t.dom.window.close();
  }
});

test('15. hc-lang inválida: initLang cai para en', async () => {
  await withBoot(({ w, $ }) => {
    w.localStorage.setItem('hc-lang', 'xx_invalida');
    w.initLang();
    assert.equal($('#lang').value, 'en');
    assert.equal(w.document.documentElement.lang, 'en');
  });
});
