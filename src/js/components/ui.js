/// Setup Header & Footer
import { logout } from './session.js';

let header, footer
export async function createHeaderFooter() {
    if (!header) {
        header = await fetch('/components/header.html').then(res => res.text())
    }
    if (!footer) {
        footer = await fetch('/components/footer.html').then(r => r.text());
    }

    $body.insertAdjacentHTML('afterbegin', header);
    $body.insertAdjacentHTML('beforeend', footer);
}

export function setupHeader() {
    /// Header
    // Mobile menu toggle
    const menuToggle = $('#menuToggle');
    const navLinksContainer = $('#navLinks');

    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    $$('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Logout buttons
    $$('.logout-btn').forEach(btn => {
        btn.addEventListener('click', logout);
    });
}

export function updateHeaderAuth(user) {
    const login = $$('.login-btn');
    const signup = $$('.signup-btn');
    const logout = $$('.logout-btn');
    const logo = $('.logo');
    if (!login.length || !signup.length || !logout.length || !logo) {
        // Try again
        setTimeout(() => updateHeaderAuth(user), 50);
        return;
    }

    if (user) {
        logout.forEach(btn => btn.style.display = 'inline-flex');

    } else {
        login.forEach(btn => btn.style.display = 'inline-flex');
        signup.forEach(btn => btn.style.display = 'inline-flex');
    }

    logo.href = !!user ? '/dashboard' : '/home';
}


/// Toast
export function toast({ title, message = '', type = 'info', duration = 3000 }) {
    if (!$('#toast')) {
        // Create toast container
        const container = document.createElement('div');
        container.id = 'toast';

        $body.appendChild(container);
    }

    const main = $('#toast');
    if (main) {
        const toast = document.createElement('div');

        // Auto remove toast
        const autoRemoveId = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            main.removeChild(toast);

            clearTimeout(autoRemoveId);
        }

        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle',
            error: 'fas fa-exclamation-circle'
        }
        const titles = {
            success: 'Success',
            info: 'Info',
            warning: 'Warning',
            error: 'Error'
        }
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                        <div class='toast__icon'>
                            <i class='${icon}'></i>
                        </div>
                        <div class='toast__body'>
                            <h3 class='toast__title'>${title || titles[type] || ''}</h3>
                            <p class='toast__msg'>${message || (type === 'error' ? 'An unknown error occurred' : '')}</p>
                        </div>
                        <div class='toast__close'>
                            <i class='fas fa-times'></i>
                        </div>
                    `;
        main.appendChild(toast);
    }
}