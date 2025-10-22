// Global variables
window.$ready = false;
window.$authDone = false;

window.$ = (selector) => document.querySelector(selector);
window.$$ = (selector) => document.querySelectorAll(selector);

window.$loc = window.location;

window.$jrotc = $loc.hostname.includes('jrotccadets');

window.$go = (url) => $loc.href = url;
window.$getPath = () => $loc.pathname.replace(/^\//, '');

window.$value = (e, selector, trim = true) => {
    const input = e.target.elements[selector];
    if (!input) return '';
    return trim ? input.value.trim() : input.value;
}

window.$body = document.body;


/// Main
import { waitForDOM } from '../components/utils.js';

function createLink(rel, type, href) {
    const link = document.createElement('link');
    link.rel = rel;
    link.type = type || 'text/css';
    link.href = href;
    
    document.head.appendChild(link);
}

async function main() {
    // Wait for page to load
    await waitForDOM();


    // Add link logo
    createLink('icon', 'image/png', '/assets/link-logo.png');

    // Load font awesome
    createLink('stylesheet', null, 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css')

    // Create header & footer
    await createHeaderFooter();


    // Change program
    $$('.logo img').forEach(el => {
        el.src = `/assets/${$jrotc ? 'jrotc' : 'rotc'}-logo.png`;
        el.style.display = 'block';
    });

    $$('.program-title').forEach(el => {
        el.textContent = el.textContent.replace(/JROTC/g, $jrotc ? 'JROTC' : 'ROTC');
    });


    // Unfocus input box
    $$('input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                e.preventDefault()

                input.blur();
            }
        });
    });


    // Toggle password
    $$('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';

                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');

            } else {
                input.type = 'password';

                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });


    window.$main = $('main');

    window.$ready = true;
}
main();


/// Header & Auth
import { createHeaderFooter, setupHeader, updateHeaderAuth } from '../components/ui.js'
import { get, initAuthSignal, onUserChanged, logout } from '../components/session.js';

import { PUBLIC_PAGES, SESSION_CONFIG } from '../config.js';

// Idle
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);

    const loginTime = localStorage.getItem('loginTime');
    if (loginTime && (Date.now() - loginTime) > SESSION_CONFIG.maxSessionDuration) {
        logout();

        clearTimeout(idleTimer);

        return;
    }

    idleTimer = setTimeout(() => {
        logout();

        clearTimeout(idleTimer);

        alert('You have been logged out due to inactivity.');
    }, SESSION_CONFIG.idleDuration);
}

// Setup auth
initAuthSignal();

onUserChanged(async (user, doc) => {
    if (sessionStorage.getItem('loggingOut')) {
        if (!user) {
            sessionStorage.removeItem('loggingOut');

            // Redirect back to login
            $go('/login');
        }
        return;
    }
    
    console.log(user, doc);


    const path = $getPath();
    const verified = user && user.emailVerified;

    // Check if the user needs to be verified
    const onCheckEmail = path == 'check-email'
    if (user && !verified && !onCheckEmail) {
        $go('/check-email');
        return;
    }


    // Check if the user is on a page they shouldn't
    const loginTime = localStorage.getItem('loginTime')

    const isPublic = PUBLIC_PAGES.includes(path);
    const is404 = $("meta[name='page-type'][content='404']") !== null;
    if (user && (isPublic || verified && onCheckEmail)) {
        // Is on a public page while logged in
        $go('/dashboard');
        return;

    } else if (!user && !isPublic && !is404) {
        $go('/login');
        return;
    }


    // Setup page
    $body.style.display = 'grid';

    setupHeader();
    updateHeaderAuth(user);

    if (user) {
        // Logged in
        if (!loginTime) localStorage.setItem('loginTime', Date.now());

        // Start idle
        // Listen to user activity
        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, resetIdleTimer);
        });

        // Start timer on page load
        resetIdleTimer();
        
    } else if (loginTime) {
        // No user logged in
        localStorage.removeItem('loginTime');
    }


    window.$authDone = true;
});