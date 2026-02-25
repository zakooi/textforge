import { navigate } from '../router.js';

const TOOLS = [
    { href: '/tools/format-converter', icon: '🔄', label: 'Format Converter' },
    { href: '/tools/data-cleaner', icon: '📊', label: 'Data Cleaner' },
    { href: '/tools/password', icon: '🔐', label: 'Password' },
    { href: '/tools/diff-checker', icon: '📋', label: 'Diff Checker' },
];

export function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
    <div class="container header-inner">
      <a href="/" data-link class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Text<span>Forge</span></span>
      </a>
      <nav class="nav-links">
        ${TOOLS.map(t => `<a href="${t.href}" data-link class="nav-link">${t.icon} ${t.label}</a>`).join('')}
      </nav>
      <button class="btn btn-primary btn-sm mobile-menu-toggle" id="menuToggle">☰ Tools</button>
    </div>
    <div class="mobile-nav" id="mobileNav">
      ${TOOLS.map(t => `<a href="${t.href}" data-link class="mobile-nav-link">${t.icon} ${t.label}</a>`).join('')}
    </div>
  `;

    // Mobile menu toggle
    header.querySelector('#menuToggle')?.addEventListener('click', () => {
        header.querySelector('#mobileNav')?.classList.toggle('open');
    });

    return header;
}
