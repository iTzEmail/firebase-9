/// Setup Header & Footer
import { logout } from "./session.js";

export function setupHeaderFooter() {
    // Header
    const headerPromise = fetch("/components/header.html")
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);

            // Active navigation state management
            const navLinks = document.querySelectorAll('.nav-links a');

            // Mobile menu toggle functionality
            const menuToggle = document.getElementById('menuToggle');
            const navLinksContainer = document.getElementById('navLinks');

            menuToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
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

            // Logout
            const logoutBtns = document.querySelectorAll(".logout-btn");
            logoutBtns.forEach(btn => {
                btn.addEventListener("click", logout);
            });
        })
        .catch(err => console.error("Error loading header:", err));

    // Footer
    const footerPromise = fetch("/components/footer.html")
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
        })
        .catch(err => console.error("Error loading footer:", err));

    return Promise.all([headerPromise, footerPromise]);
}

export function updateHeaderAuth(user) {
    const login = document.querySelectorAll(".login-btn");
    const signup = document.querySelectorAll(".signup-btn");
    const logout = document.querySelectorAll(".logout-btn");
    const logo = document.querySelector(".logo");
    if (!login || !signup || !logout || !logo) {
        // Try again
        setTimeout(() => updateHeaderAuth(user), 50);
        return;
    }

    if (user) {
        logout.forEach(btn => btn.style.display = "inline-flex");

    } else {
        login.forEach(btn => btn.style.display = "inline-flex");
        signup.forEach(btn => btn.style.display = "inline-flex");
    }

    logo.href = !!user ? "/dashboard" : "/home";
}


/// Toast
export function toast({ title, message = "", type = "info", duration = 3000 }) {
    if (!document.getElementById("toast")) {
        const container = document.createElement("div");
        container.id = "toast";
        document.body.appendChild(container);
    }

    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

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
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        }
        const titles = {
            success: "Success",
            info: "Info",
            warning: "Warning",
            error: "Error"
        }
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                        <div class="toast__icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="toast__body">
                            <h3 class="toast__title">${title || titles[type] || ""}</h3>
                            <p class="toast__msg">${message || (type === "error" ? "An unknown error occurred" : "")}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
        main.appendChild(toast);
    }
}