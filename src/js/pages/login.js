import { login } from '../components/session.js'

$('#login').addEventListener('submit', async (e) => {
    e.preventDefault();

    login(e.target.email.value, e.target.password.value);
});