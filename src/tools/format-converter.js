import { showToast } from '../components/toast.js';

// Supported conversions
function jsonToCsv(json) {
    const obj = JSON.parse(json);
    const arr = Array.isArray(obj) ? obj : [obj];
    const headers = Object.keys(arr[0]);
    const rows = arr.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
}

function csvToJson(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,))/g) || [];
        return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').replace(/^"|"$/g, '')]));
    });
    return JSON.stringify(result, null, 2);
}

function jsonToYaml(json) {
    const obj = JSON.parse(json);
    function toYaml(o, indent = 0) {
        const sp = '  '.repeat(indent);
        if (Array.isArray(o)) return o.map(v => `${sp}- ${typeof v === 'object' ? '\n' + toYaml(v, indent + 1) : v}`).join('\n');
        if (typeof o === 'object' && o !== null) return Object.entries(o).map(([k, v]) => `${sp}${k}: ${typeof v === 'object' ? '\n' + toYaml(v, indent + 1) : v}`).join('\n');
        return String(o);
    }
    return toYaml(obj);
}

function jsonToXml(json) {
    const obj = JSON.parse(json);
    function toXml(o, tag = 'item') {
        if (Array.isArray(o)) return o.map(v => toXml(v, tag)).join('\n');
        if (typeof o === 'object' && o !== null) {
            const inner = Object.entries(o).map(([k, v]) => toXml(v, k)).join('\n');
            return `<${tag}>\n${inner}\n</${tag}>`;
        }
        return `<${tag}>${o}</${tag}>`;
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${toXml(obj)}\n</root>`;
}

const CONVERSIONS = [
    { label: 'JSON → CSV', from: 'json', to: 'csv', fn: jsonToCsv },
    { label: 'CSV → JSON', from: 'csv', to: 'json', fn: csvToJson },
    { label: 'JSON → YAML', from: 'json', to: 'yaml', fn: jsonToYaml },
    { label: 'JSON → XML', from: 'json', to: 'xml', fn: jsonToXml },
];

export function renderFormatConverter(container) {
    container.innerHTML = `
    <div class="tool-page animate-fade-up">
      <div class="tool-header">
        <h1>🔄 Format <span class="gradient-text">Converter</span></h1>
        <p>Convert between JSON, CSV, YAML, and XML instantly.</p>
      </div>

      <div class="card" style="margin-bottom:var(--space-lg)">
        <div class="form-group">
          <label>Conversion Type</label>
          <div class="conversion-tabs" id="convTabs">
            ${CONVERSIONS.map((c, i) => `
              <button class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} btn-sm conv-tab" data-idx="${i}">${c.label}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="tool-grid">
        <div class="tool-panel">
          <label id="inputLabel">Input (JSON)</label>
          <textarea id="fcInput" rows="18" placeholder='Paste your data here...'></textarea>
          <div class="tool-actions">
            <button class="btn btn-primary" id="convertBtn">🔄 Convert</button>
            <button class="btn btn-secondary btn-sm" id="fcClear">Clear</button>
            <button class="btn btn-ghost btn-sm" id="fcSample">Load Sample</button>
          </div>
        </div>
        <div class="tool-panel">
          <label id="outputLabel">Output (CSV)</label>
          <textarea id="fcOutput" rows="18" readonly placeholder="Output will appear here..."></textarea>
          <div class="tool-actions">
            <button class="btn btn-secondary btn-sm" id="fcCopy">📋 Copy</button>
            <button class="btn btn-ghost btn-sm" id="fcDownload">⬇ Download</button>
          </div>
        </div>
      </div>
    </div>
  `;

    let activeIdx = 0;

    const tabs = container.querySelectorAll('.conv-tab');
    const input = container.querySelector('#fcInput');
    const output = container.querySelector('#fcOutput');
    const inputLabel = container.querySelector('#inputLabel');
    const outputLabel = container.querySelector('#outputLabel');

    const SAMPLES = {
        json: '[{"name":"Alice","age":30,"city":"Hanoi"},{"name":"Bob","age":25,"city":"HCM"}]',
        csv: 'name,age,city\nAlice,30,Hanoi\nBob,25,HCM',
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.className = 'btn btn-ghost btn-sm conv-tab'; });
            tab.className = 'btn btn-primary btn-sm conv-tab';
            activeIdx = +tab.dataset.idx;
            const c = CONVERSIONS[activeIdx];
            inputLabel.textContent = `Input (${c.from.toUpperCase()})`;
            outputLabel.textContent = `Output (${c.to.toUpperCase()})`;
            input.value = '';
            output.value = '';
        });
    });

    container.querySelector('#convertBtn').addEventListener('click', () => {
        try {
            output.value = CONVERSIONS[activeIdx].fn(input.value.trim());
            showToast('Converted successfully!', 'success');
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
        }
    });

    container.querySelector('#fcClear').addEventListener('click', () => { input.value = ''; output.value = ''; });
    container.querySelector('#fcSample').addEventListener('click', () => {
        input.value = SAMPLES[CONVERSIONS[activeIdx].from] || '';
    });
    container.querySelector('#fcCopy').addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => showToast('Copied!', 'success'));
    });
    container.querySelector('#fcDownload').addEventListener('click', () => {
        if (!output.value) return;
        const ext = CONVERSIONS[activeIdx].to;
        const blob = new Blob([output.value], { type: 'text/plain' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `converted.${ext}`; a.click();
    });
}
