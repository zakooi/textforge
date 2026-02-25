import { showToast } from '../components/toast.js';

export function renderDataCleaner(container) {
    container.innerHTML = `
    <div class="tool-page animate-fade-up">
      <div class="tool-header">
        <h1>📊 Data <span class="gradient-text">Cleaner</span></h1>
        <p>Remove duplicates, sort, trim whitespace, and filter your text data.</p>
      </div>

      <div class="card" style="margin-bottom:var(--space-lg)">
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);align-items:center">
          <label style="margin:0;text-transform:none;font-size:.9rem;color:var(--text-primary)">Operations:</label>
          ${[
            ['removeDups', '🚫 Remove duplicates'],
            ['trimLines', '✂️ Trim whitespace'],
            ['removeEmpty', '🗑️ Remove empty lines'],
            ['sortAsc', '↑ Sort A→Z'],
            ['sortDesc', '↓ Sort Z→A'],
            ['lowercase', 'aA Lowercase'],
            ['uppercase', 'AA Uppercase'],
            ['numberedLines', '🔢 Add line numbers'],
        ].map(([id, label]) => `
            <label class="toggle-label">
              <input type="checkbox" id="${id}" checked> ${label}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="tool-grid">
        <div class="tool-panel">
          <label>Input Text</label>
          <textarea id="dcInput" rows="20" placeholder="Paste your text here (one item per line)..."></textarea>
          <div class="tool-actions">
            <button class="btn btn-primary" id="cleanBtn">✨ Clean</button>
            <button class="btn btn-secondary btn-sm" id="dcClear">Clear</button>
            <button class="btn btn-ghost btn-sm" id="dcSample">Sample</button>
          </div>
        </div>
        <div class="tool-panel">
          <label id="dcOutputLabel">Output</label>
          <textarea id="dcOutput" rows="20" readonly placeholder="Cleaned text will appear here..."></textarea>
          <div class="tool-actions">
            <button class="btn btn-secondary btn-sm" id="dcCopy">📋 Copy</button>
          </div>
        </div>
      </div>
    </div>
  `;

    const input = container.querySelector('#dcInput');
    const output = container.querySelector('#dcOutput');
    const label = container.querySelector('#dcOutputLabel');

    const SAMPLE = `  apple  \nbanana\napple\n  cherry  \n\nDURIAN\nbanana\nELDERBERRY\n`;

    container.querySelector('#cleanBtn').addEventListener('click', () => {
        let lines = input.value.split('\n');

        if (container.querySelector('#trimLines').checked) lines = lines.map(l => l.trim());
        if (container.querySelector('#removeEmpty').checked) lines = lines.filter(l => l.length > 0);
        if (container.querySelector('#removeDups').checked) lines = [...new Set(lines)];
        if (container.querySelector('#lowercase').checked) lines = lines.map(l => l.toLowerCase());
        if (container.querySelector('#uppercase').checked) lines = lines.map(l => l.toUpperCase());
        if (container.querySelector('#sortAsc').checked) lines.sort((a, b) => a.localeCompare(b));
        if (container.querySelector('#sortDesc').checked) lines.sort((a, b) => b.localeCompare(a));
        if (container.querySelector('#numberedLines').checked) lines = lines.map((l, i) => `${i + 1}. ${l}`);

        output.value = lines.join('\n');
        label.textContent = `Output (${lines.length} lines)`;
        showToast(`Cleaned! ${lines.length} lines remaining.`, 'success');
    });

    container.querySelector('#dcClear').addEventListener('click', () => { input.value = ''; output.value = ''; });
    container.querySelector('#dcSample').addEventListener('click', () => { input.value = SAMPLE; });
    container.querySelector('#dcCopy').addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => showToast('Copied!', 'success'));
    });
}
