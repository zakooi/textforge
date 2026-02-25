import { showToast } from '../components/toast.js';

function diffLines(textA, textB) {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const maxLen = Math.max(linesA.length, linesB.length);
    const rows = [];

    for (let i = 0; i < maxLen; i++) {
        const a = linesA[i] ?? null;
        const b = linesB[i] ?? null;
        if (a === b) {
            rows.push({ type: 'same', a, b, lineA: i + 1, lineB: i + 1 });
        } else if (a === null) {
            rows.push({ type: 'added', a: null, b, lineA: null, lineB: i + 1 });
        } else if (b === null) {
            rows.push({ type: 'removed', a, b: null, lineA: i + 1, lineB: null });
        } else {
            rows.push({ type: 'changed', a, b, lineA: i + 1, lineB: i + 1 });
        }
    }
    return rows;
}

function highlightDiff(a, b) {
    if (a === null || b === null) return [a ?? '', b ?? ''];
    const aChars = [...a], bChars = [...b];
    let aOut = '', bOut = '';
    const maxC = Math.max(aChars.length, bChars.length);
    for (let i = 0; i < maxC; i++) {
        const ca = aChars[i] ?? null, cb = bChars[i] ?? null;
        if (ca === cb) {
            aOut += ca || ''; bOut += cb || '';
        } else {
            if (ca != null) aOut += `<mark class="diff-char-del">${ca}</mark>`;
            if (cb != null) bOut += `<mark class="diff-char-add">${cb}</mark>`;
        }
    }
    return [aOut, bOut];
}

function buildRow(row) {
    const classes = { same: '', added: 'diff-added', removed: 'diff-removed', changed: 'diff-changed' };
    const cls = classes[row.type] || '';
    const [aHtml, bHtml] = row.type === 'changed' ? highlightDiff(row.a, row.b) : [row.a ?? '', row.b ?? ''];

    return `<tr class="${cls}">
    <td class="line-num">${row.lineA ?? ''}</td>
    <td class="diff-cell">${row.type === 'added' ? '' : aHtml}</td>
    <td class="line-num">${row.lineB ?? ''}</td>
    <td class="diff-cell">${row.type === 'removed' ? '' : bHtml}</td>
  </tr>`;
}

export function renderDiffChecker(container) {
    container.innerHTML = `
    <div class="tool-page animate-fade-up">
      <div class="tool-header">
        <h1>📋 Diff <span class="gradient-text">Checker</span></h1>
        <p>Compare two texts side-by-side with highlighted differences.</p>
      </div>

      <div class="tool-grid" style="margin-bottom:var(--space-lg)">
        <div class="tool-panel">
          <label>Text A (Original)</label>
          <textarea id="diffA" rows="14" placeholder="Paste original text here..."></textarea>
        </div>
        <div class="tool-panel">
          <label>Text B (Modified)</label>
          <textarea id="diffB" rows="14" placeholder="Paste modified text here..."></textarea>
        </div>
      </div>

      <div class="tool-actions" style="margin-bottom:var(--space-lg)">
        <button class="btn btn-primary btn-lg" id="compareBtn">⚡ Compare</button>
        <button class="btn btn-secondary btn-sm" id="diffClear">Clear</button>
        <button class="btn btn-ghost btn-sm" id="diffSample">Load Sample</button>
        <span id="diffStats" class="badge badge-purple" style="display:none"></span>
      </div>

      <div id="diffResult" class="card" style="display:none; padding:0; overflow:auto">
        <div class="diff-legend">
          <span class="legend-item removed">🔴 Removed</span>
          <span class="legend-item added">🟢 Added</span>
          <span class="legend-item changed">🟡 Changed</span>
        </div>
        <table class="diff-table" id="diffTable"></table>
      </div>
    </div>
  `;

    const A = container.querySelector('#diffA');
    const B = container.querySelector('#diffB');
    const result = container.querySelector('#diffResult');
    const table = container.querySelector('#diffTable');
    const stats = container.querySelector('#diffStats');

    const SAMPLE_A = `Hello World\nThis is line two\nSame line here\nFoo bar baz`;
    const SAMPLE_B = `Hello World!\nThis is line 2\nSame line here\nBaz bar foo`;

    container.querySelector('#compareBtn').addEventListener('click', () => {
        const rows = diffLines(A.value, B.value);
        const changed = rows.filter(r => r.type !== 'same').length;
        const added = rows.filter(r => r.type === 'added').length;
        const removed = rows.filter(r => r.type === 'removed').length;
        const modified = rows.filter(r => r.type === 'changed').length;

        table.innerHTML = `<thead><tr><th>#</th><th>Text A</th><th>#</th><th>Text B</th></tr></thead><tbody>${rows.map(buildRow).join('')}</tbody>`;
        result.style.display = 'block';
        stats.style.display = '';
        stats.textContent = `${changed} differences (${added} added, ${removed} removed, ${modified} changed)`;
        if (changed === 0) showToast('Texts are identical!', 'info');
        else showToast(`Found ${changed} difference(s)`, 'warning');
    });

    container.querySelector('#diffClear').addEventListener('click', () => {
        A.value = ''; B.value = ''; result.style.display = 'none'; stats.style.display = 'none';
    });
    container.querySelector('#diffSample').addEventListener('click', () => { A.value = SAMPLE_A; B.value = SAMPLE_B; });
}
