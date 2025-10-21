import { resetPassword } from '../components/session.js';

$('#reset').addEventListener('submit', async (e) => {
    e.preventDefault();

    resetPassword(e.target.email.value);
});