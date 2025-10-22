import { throttle } from '../components/utils.js'


/// Resend email
import { onUserChanged, resendEmail, reloadUser } from '../components/session.js';

onUserChanged(async (user) => {
    if (!user) return;

    // Display email address it is sending too
    $('#display-email').textContent = user.email;


    // Check if user has verified
    const interval = setInterval(async () => {
        reloadUser(user);

        if (user.emailVerified) {
            // Verified
            clearInterval(interval);
            
            $go('/dashboard');
        }
    }, 5000);


    // Resend email
    $('#resend-email').addEventListener('click', throttle(() => resendEmail(user), 5000));
}, true);