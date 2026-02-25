let toastTimeout;

export function showToast(message, type = 'success', duration = 2500) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `<span>${icons[type] || '✅'}</span> ${message}`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
