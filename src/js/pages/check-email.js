import { throttle } from "../components/utils.js"


/// Resend email
import { resendEmail, onUserChanged } from "../components/session.js";

onUserChanged(async (user) => {
    if (user) {
        // Display email address it is sending too
        $('#display-email').textContent = user.email;


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
        $('#resend-email').addEventListener("click", throttle(resendEmail, 5000));
    }
});