import { navigate } from '../router.js';
import { createHeader } from '../components/header.js';

const TOOLS = [
    {
        href: '/tools/format-converter',
        icon: '🔄',
        title: 'Format Converter',
        desc: 'Convert between JSON, CSV, YAML, and XML instantly. All-in-one, no size limit.',
        badge: 'Popular',
        badgeType: 'purple',
        delay: '0ms',
    },
    {
        href: '/tools/data-cleaner',
        icon: '📊',
        title: 'Data Cleaner',
        desc: 'Remove duplicate lines, sort data, trim whitespace, and filter text with one click.',
        badge: 'Utility',
        badgeType: 'blue',
        delay: '80ms',
    },
    {
        href: '/tools/password',
        icon: '🔐',
        title: 'Password Generator',
        desc: 'Generate strong, memorable passwords with strength meter and crack-time estimate.',
        badge: 'Security',
        badgeType: 'green',
        delay: '160ms',
    },
    {
        href: '/tools/diff-checker',
        icon: '📋',
        title: 'Diff Checker',
        desc: 'Compare two texts side-by-side with highlighted differences and line numbers.',
        badge: 'Comparison',
        badgeType: 'yellow',
        delay: '240ms',
    },
];

export function renderHome(container) {
    container.innerHTML = `
    <section class="hero">
      <div class="container">
        <div class="hero-badge">⚡ Free · No login · No ads</div>
        <h1>Your <span class="gradient-text">Text & Data</span><br>Toolkit</h1>
        <p>8 powerful tools to convert, clean, generate, and compare text and data. Completely free, works offline, no tracking.</p>
        <div class="hero-actions">
          <a href="/tools/format-converter" data-link class="btn btn-primary btn-lg">🔄 Start Converting</a>
          <a href="#tools" class="btn btn-secondary btn-lg">Explore Tools</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">8</span><span class="stat-label">Tools</span></div>
          <div class="stat"><span class="stat-num">100%</span><span class="stat-label">Free</span></div>
          <div class="stat"><span class="stat-num">0</span><span class="stat-label">Tracking</span></div>
        </div>
      </div>
    </section>

    <section class="tools-section" id="tools">
      <div class="container">
        <h2 class="section-title">All <span class="gradient-text">Tools</span></h2>
        <p class="section-subtitle">Click any tool to get started instantly.</p>
        <div class="tools-grid">
          ${TOOLS.map(t => `
            <a href="${t.href}" data-link class="tool-card" style="animation-delay:${t.delay}">
              <span class="tool-card-arrow">↗</span>
              <span class="tool-card-icon">${t.icon}</span>
              <div class="badge badge-${t.badgeType}" style="margin-bottom:0.75rem">${t.badge}</div>
              <h3>${t.title}</h3>
              <p>${t.desc}</p>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
