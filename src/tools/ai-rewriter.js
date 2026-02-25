import { callAI, FREE_MODELS } from '../utils/openrouter.js';

/**
 * Render the AI Text Rewriter tool
 * @param {HTMLElement} container 
 */
export function renderAiRewriter(container) {
    container.innerHTML = `
    <div class="tool-page animate-fade-up" style="max-width:800px">
      <div class="tool-header">
        <div class="tool-title-wrap">
          <span class="tool-icon">✨</span>
          <h1 class="tool-title">AI Text <span>Rewriter</span></h1>
        </div>
        <p class="tool-desc">Rewrite, improve, or change the tone of your text using AI.</p>
      </div>
      
      <div class="card shadow">
      
      <!-- Input Section -->
      <div class="tool-io">
        <div class="io-header">
          <label>Original Text</label>
          <div class="io-actions">
            <button class="btn btn-icon btn-sm" id="btn-paste" title="Paste text">
              <span>📋</span> Paste
            </button>
            <button class="btn btn-icon btn-sm btn-danger" id="btn-clear" title="Clear input">
              <span>🗑️</span> Clear
            </button>
          </div>
        </div>
        <textarea id="input-text" class="input-area" placeholder="Paste your text here..." rows="8"></textarea>
      </div>
      
      <!-- Controls Section -->
      <div class="tool-controls" style="margin: var(--space-lg) 0;">
        <div class="control-group">
          <label class="control-label">Rewrite Tone/Style</label>
          <div class="conversion-tabs" id="style-tabs">
            <button class="btn btn-tab active" data-style="improve">Professional & Improve</button>
            <button class="btn btn-tab" data-style="casual">Friendly & Casual</button>
            <button class="btn btn-tab" data-style="shorter">Make it Shorter</button>
            <button class="btn btn-tab" data-style="longer">Expand & Elaborate</button>
            <button class="btn btn-tab" data-style="grammar">Fix Grammar Only</button>
          </div>
        </div>
        
        <div class="control-group" style="margin-top: 1rem;">
          <label class="control-label" for="model-select">AI Model (Free options)</label>
          <select id="model-select" class="input-area" style="padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); cursor: pointer;">
            ${FREE_MODELS.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
          </select>
        </div>
        
        <div class="control-row" style="margin-top: 1.5rem;">
            <button id="btn-rewrite" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;">
              <span id="btn-icon">✨</span> <span id="btn-text">Rewrite Text with AI</span>
            </button>
        </div>
        
        <div id="loading-indicator" style="display:none; text-align:center; padding: 1rem; color: var(--text-secondary);">
            <div style="display:inline-block; animation: spin 1s linear infinite; margin-right:8px;">⏳</div>
            AI is thinking...
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="tool-io" id="output-section" style="display: none;">
        <div class="io-header">
          <label>Rewritten Text</label>
          <div class="io-actions">
            <button class="btn btn-icon btn-sm" id="btn-copy" title="Copy result">
              <span>📋</span> Copy Result
            </button>
          </div>
        </div>
        <textarea id="output-text" class="input-area output-area" readonly rows="8"></textarea>
      </div>

      <div id="error-message" style="display:none; margin-top:1rem; padding: 1rem; background: rgba(255,85,119,0.1); border: 1px solid var(--red); color: var(--red); border-radius: var(--radius-sm);">
      </div>
      </div>
      
    </div>
  </div>
  `;

    // Attach events
    initLogic(container);
}

function initLogic(container) {
    const inputEl = container.querySelector('#input-text');
    const outputEl = container.querySelector('#output-text');
    const btnPaste = container.querySelector('#btn-paste');
    const btnClear = container.querySelector('#btn-clear');
    const btnCopy = container.querySelector('#btn-copy');
    const btnRewrite = container.querySelector('#btn-rewrite');

    const btnIcon = container.querySelector('#btn-icon');
    const btnText = container.querySelector('#btn-text');
    const loadingIndicator = container.querySelector('#loading-indicator');
    const outputSection = container.querySelector('#output-section');
    const errorMsg = container.querySelector('#error-message');
    const modelSelect = container.querySelector('#model-select');

    const styleTabs = container.querySelectorAll('#style-tabs .btn-tab');
    let currentStyle = 'improve';

    // Tab Switching logic
    styleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            styleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentStyle = tab.dataset.style;
        });
    });

    // Paste
    btnPaste.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputEl.value = text;
        } catch (err) {
            alert("Please allow clipboard access or use Ctrl+V");
        }
    });

    // Clear
    btnClear.addEventListener('click', () => {
        inputEl.value = '';
        outputSection.style.display = 'none';
        errorMsg.style.display = 'none';
        inputEl.focus();
    });

    // Copy
    btnCopy.addEventListener('click', () => {
        outputEl.select();
        document.execCommand('copy');

        // Show toast (assuming a global toast function exists, if not just feedback on button)
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = '<span>✅</span> Copied!';
        setTimeout(() => { btnCopy.innerHTML = originalText; }, 2000);
    });

    // Action Button
    btnRewrite.addEventListener('click', async () => {
        const text = inputEl.value.trim();
        if (!text) {
            inputEl.style.borderColor = 'var(--red)';
            setTimeout(() => inputEl.style.borderColor = 'var(--border)', 1000);
            return;
        }

        // Prepare UI for loading state
        errorMsg.style.display = 'none';
        outputSection.style.display = 'none';
        btnRewrite.disabled = true;
        loadingIndicator.style.display = 'block';

        try {
            const systemPrompt = getSystemPrompt(currentStyle);
            const selectedModelID = modelSelect.value;
            const result = await callAI(systemPrompt, text, selectedModelID);

            outputEl.value = result;
            outputSection.style.display = 'block';
            setTimeout(() => outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

        } catch (error) {
            errorMsg.textContent = error.message || "Failed to contact AI service. Please try again later.";
            errorMsg.style.display = 'block';
        } finally {
            btnRewrite.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });
}

function getSystemPrompt(style) {
    const basePrompt = "You are an expert copywriter and editor. Your task is to rewrite the text provided by the user according to specific constraints. DO NOT add conversational filler like 'Here is the rewritten text' or 'Sure!'. ONLY output the final rewritten text.";

    switch (style) {
        case 'improve':
            return `${basePrompt} Make the text sound highly professional, clear, and engaging. Improve word choice, fix any grammatical errors, and ensure strong structure.`;
        case 'casual':
            return `${basePrompt} Rewrite the text to sound friendly, conversational, and approachable. Imagine you are writing a message to a colleague or a blog post for a general audience.`;
        case 'shorter':
            return `${basePrompt} Summarize and condense the text. Make it significantly shorter while retaining the core message and key details. Remove any fluff or redundancy.`;
        case 'longer':
            return `${basePrompt} Expand on the text. Elaborate on the core points, add relevant professional context or examples if appropriate, and make the text longer and more detailed while maintaining the original meaning.`;
        case 'grammar':
            return `${basePrompt} DO NOT change the tone or word choice unless absolutely necessary. Your ONLY job is to identify and fix spelling, grammar, punctuation, and structural errors.`;
        default:
            return `${basePrompt} Improve the text.`;
    }
}
