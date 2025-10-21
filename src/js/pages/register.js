import { toast } from '../components/ui.js';

import { REGISTER } from '../config.js';
const checks = REGISTER.required;


// Required input
$$('#register input').forEach(input => {
    const errorSpan = input.closest('.form-field').querySelector('.error-message');
    if (!errorSpan) {
        return;
    }

    input.addEventListener('input', () => {
        if (!input.value.trim()) {
            errorSpan.textContent = 'This field is required';

        } else {
            errorSpan.textContent = '';
        }
    });
});


// Password checklist
const passwordInput = $('#password');
const checklist = $('.password-checklist');
for (const [key, value] of Object.entries(checks)) {
    const li = document.createElement('li');
    li.dataset.check = key;
    li.textContent = `*${value.text}`;

    checklist.appendChild(li);
}
passwordInput.closest('.form-field').appendChild(checklist);

passwordInput.addEventListener('input', () => {
    for (const [key, { regex }] of Object.entries(checks)) {
        const item = checklist.querySelector(`[data-check='${key}']`);
        item.style.color = regex.test(passwordInput.value) ? 'green' : 'red';
    }
});

const confirmInput = $('#confirmPassword');
confirmInput.addEventListener('input', () => {
    const errorSpan = confirmInput.closest('.form-field').querySelector('.error-message');
    if (confirmInput.value && confirmInput.value !== passwordInput.value) {
        errorSpan.textContent = 'Passwords do not match';

    } else {
        errorSpan.textContent = '';
    }
});



// Register
import { register } from '../components/session.js';

$('#register').addEventListener('submit', async (e) => {
    e.preventDefault();

    $body.classList.add('loading');

    try {
        const password = $value(e, 'password', false);
        const confirm = $value(e, 'confirmPassword', false);

        // Check reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse.length > 0) {
            toast({ message: 'Please complete the reCAPTCHA', type: 'warning' });
            return;
            
        } else if (!Object.values(checks).every(({ regex }) => regex.test(password))) {
            toast({ message: 'Password does not meet the required criteria', type: 'warning' });
            return;

        } else if (password !== confirm) {
            toast({ message: 'Passwords do not match', type: 'warning' });
            return;
        }
        
        // Create the account
        register(
            $value(e, 'firstName'),
            $value(e, 'lastName'),
            $value(e, 'email'),
            password
        );

    } finally {
        $body.classList.remove('loading');
    }
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
    })
});