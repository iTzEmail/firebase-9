import { auth } from '../components/firebase.js';


// Global variables
window.$ = (selector) => document.querySelector(selector);
window.$$ = (selector) => document.querySelectorAll(selector);

window.$go = (url) => window.location.replace(url);
window.$path = () => window.location.pathname.replace(/^\//, '');

window.$value = (e, selector, trim = true) => {
    const input = e.target.elements[selector];
    if (!input) return '';
    return trim ? input.value.trim() : input.value;
}

window.$body = document.body;
window.$header = $('header');
window.$main = $('main');


// Cookies
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error)
});


/// Header & Auth
import { wait } from '../components/utils.js'
import { setupHeaderFooter, updateHeaderAuth } from '../components/ui.js'
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
    console.log(user);

    if (sessionStorage.getItem('loggingOut')) {
        if (!user) {
            await wait(500);

            // User is logging out, redirect
            sessionStorage.removeItem('loggingOut');

            $go('/login');
        }
        return;
    }


    const verified = user && user.emailVerified;

    // Check if the user needs to be verified
    const onCheckEmail = $path == 'check-email'
    if (user && !verified && !onCheckEmail) {
        $go('/check-email');
        return;
    }


    // Check if the user is on a page they shouldn't
    const loginTime = localStorage.getItem('loginTime')

    const isPublic = PUBLIC_PAGES.includes($path);
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
    setupHeaderFooter().then(() => {
        updateHeaderAuth(user);
    });

    $body.style.display = 'grid';

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


/// Unfocus input box
$$('input').forEach(input => {
    input.addEventListener('keydown', function(e) {
        if (e.key == 'Enter') {
            e.preventDefault()

            input.blur();
        }
    });
})