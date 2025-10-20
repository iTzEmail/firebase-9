import { resetPassword } from "../components/session.js";

const reset = document.getElementById("reset");
if (reset) {
    reset.addEventListener("submit", async (e) => {
        e.preventDefault();

        resetPassword(e.target.email.value);
    });
}