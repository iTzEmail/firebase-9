// Global variables
window.$ = (selector) => document.querySelector(selector);
window.$$ = (selector) => document.querySelectorAll(selector);

window.$loc = window.location
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

async function main() {
    await waitForDOM();


    await createHeaderFooter();

    window.$header = $('header');
    window.$main = $('main');


    // Unfocus input box
    $$('input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                e.preventDefault()

                input.blur();
            }
        });
    });
}

const ready = main();


/// Header & Auth
import { createHeaderFooter, setupHeader, updateHeaderAuth } from '../components/ui.js'
import { logout, initAuthSignal, onUserChanged } from '../components/session.js';

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

onUserChanged(async (user) => {
    await ready;

    if (sessionStorage.getItem('loggingOut')) {
        if (!user) {
            sessionStorage.removeItem('loggingOut');

            // Redirect back to login
            $go('/login');
        }
        return;
    }


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
});