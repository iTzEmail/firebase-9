import { resetPassword } from '../components/session.js';

$('#forgot').addEventListener('submit', async (e) => {
    e.preventDefault();

    resetPassword(e.target.email.value);
});