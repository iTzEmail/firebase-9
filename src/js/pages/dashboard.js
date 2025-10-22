import { get, onUserChanged } from '../components/session.js';

onUserChanged(async (user, doc) => {
    if (!user) return;

    console.log(await get('battalions', 'dceJVHJ2HDIHuvHGSXfA'));
}, true);