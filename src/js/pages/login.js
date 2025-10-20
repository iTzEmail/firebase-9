import { login } from "../components/session.js"

const loginBtn = document.getElementById("login");
if (loginBtn) {
    loginBtn.addEventListener("submit", async (e) => {
        e.preventDefault();

        login(e.target.email.value, e.target.password.value);
    });
}