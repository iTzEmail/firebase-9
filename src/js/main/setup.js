import { auth } from "../components/firebase.js";


// Cookies
import { setPersistence, browserLocalPersistence } from "firebase/auth";

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error)
});


/// Header & Auth
import { onAuthStateChanged  } from "firebase/auth";

import { wait } from "../components/utils.js"
import { setupHeaderFooter, updateHeaderAuth } from "../components/ui.js"
import { logout, initAuthSignal, onUserChanged } from "../components/session.js";

import { PUBLIC_PAGES, SESSION_CONFIG } from "../config.js";

// Idle
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);

    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && (Date.now() - loginTime) > SESSION_CONFIG.maxSessionDuration) {
        logout();

        clearTimeout(idleTimer);

        return;
    }

    idleTimer = setTimeout(() => {
        logout();

        clearTimeout(idleTimer);

        alert("You have been logged out due to inactivity.");
    }, SESSION_CONFIG.idleDuration);
}

// Setup auth
initAuthSignal();

onUserChanged(async (user) => {
    console.log(user);

    if (sessionStorage.getItem("loggingOut")) {
        if (!user) {
            await wait(500);

            // User is logging out, redirect
            sessionStorage.removeItem("loggingOut");

            window.location.replace("/login");
        }
        return;
    }


    const path = window.location.pathname.replace(/^\//, '');
    const verified = user && user.emailVerified

    // Check if the user needs to be verified
    const onCheckEmail = path == "check-email"
    if (user && !verified && !onCheckEmail) {
        window.location.replace("/check-email");
        return;
    }


    // Check if the user is on a page they shouldn't
    const loginTime = localStorage.getItem("loginTime")

    const isPublic = PUBLIC_PAGES.includes(path);
    const is404 = document.querySelector('meta[name="page-type"][content="404"]') !== null;
    if (user && (isPublic || verified && onCheckEmail)) {
        // Is on a public page while logged in
        window.location.replace("/dashboard");
        return;

    } else if (!user && !isPublic && !is404) {
        window.location.replace('/login');
        return;
    }


    // Setup page
    setupHeaderFooter().then(() => {
        updateHeaderAuth(user);
    });

    document.body.style.display = "grid";

    if (user) {
        // Logged in
        if (!loginTime) localStorage.setItem("loginTime", Date.now());

        // Start idle
        // Listen to user activity
        ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt => {
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
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            e.preventDefault()

            input.blur();
        }
    });
})