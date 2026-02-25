import { showToast } from '../components/toast.js';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIGUOUS = /[0OIl1]/g;

function randomChar(set) {
    return set[Math.floor(Math.random() * set.length)];
}

function generatePassword({ length, useLower, useUpper, useDigits, useSymbols, noAmbiguous }) {
    let chars = '';
    if (useLower) chars += LOWERCASE;
    if (useUpper) chars += UPPERCASE;
    if (useDigits) chars += DIGITS;
    if (useSymbols) chars += SYMBOLS;
    if (!chars) chars = LOWERCASE;
    if (noAmbiguous) chars = chars.replace(AMBIGUOUS, '');

    let pwd = '';
    if (useLower) pwd += randomChar(LOWERCASE);
    if (useUpper) pwd += randomChar(UPPERCASE);
    if (useDigits) pwd += randomChar(DIGITS);
    if (useSymbols) pwd += randomChar(SYMBOLS);
    while (pwd.length < length) pwd += randomChar(chars);

    return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

function calcStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 2) return { label: 'Weak', color: 'var(--red)', width: '25%' };
    if (score <= 4) return { label: 'Fair', color: 'var(--yellow)', width: '50%' };
    if (score <= 5) return { label: 'Good', color: 'var(--blue)', width: '70%' };
    return { label: 'Strong', color: 'var(--green)', width: '100%' };
}

function estimateCrackTime(pwd) {
    const charset = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].reduce((n, r) => n + (r.test(pwd) ? 26 : 0), 0) + 10;
    const combinations = Math.pow(charset, pwd.length);
    const guessesPerSec = 1e10;
    const secs = combinations / guessesPerSec;
    if (secs < 1) return 'Instant';
    if (secs < 60) return `${Math.round(secs)} seconds`;
    if (secs < 3600) return `${Math.round(secs / 60)} minutes`;
    if (secs < 86400) return `${Math.round(secs / 3600)} hours`;
    if (secs < 31536000) return `${Math.round(secs / 86400)} days`;
    if (secs < 3.15e9) return `${Math.round(secs / 31536000)} years`;
    return `${(secs / 3.15e9).toExponential(1)} centuries`;
}

export function renderPasswordGenerator(container) {
    container.innerHTML = `
    <div class="tool-page animate-fade-up" style="max-width:700px">
      <div class="tool-header">
        <h1>🔐 Password <span class="gradient-text">Generator</span></h1>
        <p>Generate strong, secure passwords with strength analysis.</p>
      </div>

      <div class="card" style="margin-bottom:var(--space-lg)">
        <div class="pwd-output-wrap">
          <input type="text" id="pwdOutput" readonly value="Click Generate →" class="pwd-output-field" />
          <button class="btn btn-ghost btn-sm" id="pwdCopy" title="Copy">📋</button>
        </div>

        <div class="strength-bar-wrap" id="strengthWrap" style="margin-top:var(--space-md)">
          <div class="strength-bar-track">
            <div class="strength-bar-fill" id="strengthFill"></div>
          </div>
          <span class="strength-label" id="strengthLabel"></span>
        </div>
        <p class="crack-time" id="crackTime"></p>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Password Length: <strong id="lenVal">16</strong></label>
          <input type="range" id="pwdLen" min="6" max="64" value="16" style="font-family:var(--font)" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-lg)">
          ${[
            ['useLower', '✅ Lowercase (a-z)', true],
            ['useUpper', '✅ Uppercase (A-Z)', true],
            ['useDigits', '✅ Digits (0-9)', true],
            ['useSymbols', '✅ Symbols (!@#...)', false],
            ['noAmbig', '✅ Avoid Ambiguous (0,O,I,l)', false],
        ].map(([id, label, checked]) => `
            <label class="toggle-label">
              <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> ${label}
            </label>
          `).join('')}
        </div>
        <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" id="genBtn">⚡ Generate</button>
          <button class="btn btn-secondary" id="gen5Btn">Generate 5</button>
        </div>
      </div>

      <div id="batchOutput" style="margin-top:var(--space-lg)"></div>
    </div>
  `;

    const pwdOutput = container.querySelector('#pwdOutput');
    const lenSlider = container.querySelector('#pwdLen');
    const lenVal = container.querySelector('#lenVal');
    const strengthFill = container.querySelector('#strengthFill');
    const strengthLabel = container.querySelector('#strengthLabel');
    const crackTime = container.querySelector('#crackTime');
    const batchOutput = container.querySelector('#batchOutput');

    lenSlider.addEventListener('input', () => { lenVal.textContent = lenSlider.value; });

    function getOptions() {
        return {
            length: +lenSlider.value,
            useLower: container.querySelector('#useLower').checked,
            useUpper: container.querySelector('#useUpper').checked,
            useDigits: container.querySelector('#useDigits').checked,
            useSymbols: container.querySelector('#useSymbols').checked,
            noAmbiguous: container.querySelector('#noAmbig').checked,
        };
    }

    function showPwd(pwd) {
        pwdOutput.value = pwd;
        const s = calcStrength(pwd);
        strengthFill.style.width = s.width;
        strengthFill.style.background = s.color;
        strengthLabel.textContent = s.label;
        strengthLabel.style.color = s.color;
        crackTime.textContent = `Estimated crack time: ${estimateCrackTime(pwd)}`;
        crackTime.style.color = 'var(--text-muted)';
        crackTime.style.fontSize = '0.8rem';
        crackTime.style.marginTop = '0.5rem';
    }

    container.querySelector('#genBtn').addEventListener('click', () => {
        showPwd(generatePassword(getOptions()));
        batchOutput.innerHTML = '';
    });

    container.querySelector('#gen5Btn').addEventListener('click', () => {
        const opts = getOptions();
        const passwords = Array.from({ length: 5 }, () => generatePassword(opts));
        showPwd(passwords[0]);
        batchOutput.innerHTML = `
      <div class="card">
        <label style="margin-bottom:var(--space-md)">5 Generated Passwords</label>
        ${passwords.map(p => `
          <div class="batch-pwd-row">
            <code class="pwd-code">${p}</code>
            <button class="btn btn-ghost btn-sm" onclick="navigator.clipboard.writeText('${p}')">📋</button>
          </div>
        `).join('')}
      </div>`;
    });

    container.querySelector('#pwdCopy').addEventListener('click', () => {
        if (!pwdOutput.value || pwdOutput.value === 'Click Generate →') return;
        navigator.clipboard.writeText(pwdOutput.value).then(() => showToast('Password copied!', 'success'));
    });
}
