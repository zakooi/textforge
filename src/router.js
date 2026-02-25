/**
 * TextForge — Simple SPA Router
 */
const routes = {};

export function addRoute(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.history.pushState({}, '', path);
    render(path);
}

function render(path) {
    const content = document.getElementById('router-view');
    if (!content) return;

    // Match exact or wildcard
    const handler = routes[path] || routes['404'];
    if (handler) {
        content.innerHTML = '';
        handler(content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export function initRouter() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => render(window.location.pathname));

    // Intercept all internal link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            navigate(link.getAttribute('href') || link.dataset.href);
        }
    });

    // Initial render
    render(window.location.pathname);
}
