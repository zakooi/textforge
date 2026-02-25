import './styles/global.css';
import './styles/components.css';
import './styles/tools.css';

import { addRoute, initRouter, navigate } from './router.js';
import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderFormatConverter } from './tools/format-converter.js';
import { renderDataCleaner } from './tools/data-cleaner.js';
import { renderPasswordGenerator } from './tools/password-generator.js';
import { renderDiffChecker } from './tools/diff-checker.js';

// Build layout
const app = document.getElementById('app');
app.appendChild(createHeader());

const routerView = document.createElement('main');
routerView.id = 'router-view';
routerView.className = 'page-content';
app.appendChild(routerView);

app.appendChild(createFooter());

// Register routes
addRoute('/', renderHome);
addRoute('/tools/format-converter', renderFormatConverter);
addRoute('/tools/data-cleaner', renderDataCleaner);
addRoute('/tools/password', renderPasswordGenerator);
addRoute('/tools/diff-checker', renderDiffChecker);
addRoute('404', (el) => {
  el.innerHTML = `
    <div class="container" style="text-align:center;padding:var(--space-2xl) 0">
      <h1 style="font-size:5rem">🔍</h1>
      <h2>Page not found</h2>
      <p style="color:var(--text-secondary);margin:1rem 0">The page you're looking for doesn't exist.</p>
      <a href="/" data-link class="btn btn-primary">← Back to Home</a>
    </div>`;
});

// Start router
initRouter();
