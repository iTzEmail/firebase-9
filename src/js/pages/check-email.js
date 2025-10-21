import { throttle } from "../components/utils.js"


/// Resend email
import { resendEmail, onUserChanged } from "../components/session.js";

document.addEventListener("DOMContentLoaded", () => {
    const resend = document.getElementById("resend-email");
    const display_email = document.getElementById("display-email");
    if (resend && display_email) {
        onUserChanged(async (user) => {
            if (user) {
                // Display email address it is sending too
                display_email.textContent = user.email;


                // Check if user has verified
                const interval = setInterval(async () => {
                    await reload(user);

                    if (user.emailVerified) {
                        // Verified
                        clearInterval(interval);
                        
                        window.location.replace("/dashboard");
                    }
                }, 5000);


                // Resend email
                resend.addEventListener("click", throttle(resendEmail, 5000));
            }
        });
    }
});