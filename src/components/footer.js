export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="logo-text">⚡ Text<span>Forge</span></span>
        <p>Smart Text & Data Tools, powered by AI</p>
      </div>
      <div class="footer-links">
        <a href="/" data-link>Home</a>
        <a href="/about" data-link>About</a>
        <a href="/privacy" data-link>Privacy</a>
      </div>
      <div class="footer-copy">
        <p>© ${new Date().getFullYear()} TextForge. Free to use.</p>
      </div>
    </div>
  `;
    return footer;
}
