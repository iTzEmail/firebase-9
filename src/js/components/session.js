import { auth, db } from "./firebase.js";
import { waitFor } from "./utils.js";
import { toast } from "./ui.js";

import { ERRORS } from "../config.js";



/// Get
export async function get(collection, key) {
    const snap = await getDoc(doc(db, collection, key));
    if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
    }
}


/// Auth State Changed
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function getUser(user) {
    user = user || auth.currentUser;
    
    return [user, (user && await get('users', user.uid))];
}

const listeners = new Set();
export function onUserChanged(callback, checkIfExists) {
    listeners.add(callback);

    if (checkIfExists) {
        (async () => {
            await waitFor(() => $authDone);

            const [user, doc] = await getUser();
            if (user && doc) {
                callback(user, doc);
            }
        })();
    }

    return () => listeners.delete(callback);
}

export function initAuthSignal() {
    onAuthStateChanged(auth, async (user) => {
        await waitFor(() => $ready);
        
        const [userData, doc] = await getUser(user);
        for (const fn of listeners) fn(userData, doc);
    });
}


/// Register
import { setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export async function register(firstName, lastName, email, password) {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Send email
        await sendEmailVerification(user);
        
        alert("Verification email sent! Please check your inbox.");

        
        // Add user to db
        await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            email,
            role: 'cadet',
            battalionId: null,
            createdAt: serverTimestamp()
        });


        $go('/check-email');

    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        toast({ message: ERRORS.REGISTER[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}


/// Resend Email
export async function resendEmail(user) {
    try {
        await sendEmailVerification(user);

        toast({ message: "Verification email resent! Check your inbox.", type: "success" });

    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        toast({ message: ERRORS.CHECK_EMAIL[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}


/// Login
import { signInWithEmailAndPassword, reload } from "firebase/auth";

export async function login(email, password) {
    try {
        const info = await signInWithEmailAndPassword(auth, email, password);
        const user = info.user;
        if (!user.emailVerified) {
            $go('/check-email');

            alert("Please verify your email before logging in.");

            return;
        };

        $go('/dashboard');
        
    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        // toast({ message: ERRORS.LOGIN[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}

export async function reloadUser(user) {
    user = user || auth.currentUser;
    if (!user) return;

    await reload(user);
}


/// Reset Password
import { sendPasswordResetEmail } from "firebase/auth";

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);

        alert("Password reset email sent. Check your inbox.");

        $go('/login');

    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        // toast({ message: ERRORS.RESET[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}


/// Logout
import { signOut } from "firebase/auth";

export async function logout() {
    try {
        sessionStorage.setItem("loggingOut", true);

        await signOut(auth);

        localStorage.removeItem("loginTime");

    } catch (err) {
        toast({ message: "An unknown error occurred. Please try again.", type: "error" });
    }
}