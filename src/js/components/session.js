import { auth, db } from "./firebase.js";
import { toast } from "./ui.js"

import { ERRORS } from "../config.js";


/// Register
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export async function register(firstName, lastName, email, password) {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Send email
        await sendEmailVerification(user);
        
        alert("Verification email sent! Please check your inbox.");

        
        // Add user to db
        const colRef = collection(db, 'users');
        await addDoc(colRef, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: serverTimestamp()
        });


        window.location.replace("/check-email");

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
import { signInWithEmailAndPassword } from "firebase/auth";

export async function login(email, password) {
    try {
        const info = await signInWithEmailAndPassword(auth, email, password);
        const user = info.user;
        if (!user.emailVerified) {
            window.location.replace("/check-email");

            alert("Please verify your email before logging in.");

            return;
        };

        window.location.replace("/dashboard");
        
    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        // toast({ message: ERRORS.LOGIN[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}


/// Reset Password
import { sendPasswordResetEmail } from "firebase/auth";

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);

        alert("Password reset email sent. Check your inbox.");

        window.location.replace("/login");

    } catch (error) {
        const code = error.code || error.message;
        const cleanedCode = code.includes("(") ? code.match(/\((.*)\)/)[1] : code;
        // toast({ message: ERRORS.RESET[cleanedCode] || "An unknown error occurred", type: "error" });

        throw new Error(code)
    }
}


/// Logout
import { signOut, setPersistence, browserSessionPersistence } from "firebase/auth";

export async function logout() {
    try {
        sessionStorage.setItem("loggingOut", true);

        console.log("before:", auth.currentUser);
        
        await setPersistence(auth, browserSessionPersistence);

        await signOut(auth);

        localStorage.removeItem("loginTime");

        console.log("after:", auth.currentUser);

    } catch (err) {
        toast({ message: "An unknown error occurred. Please try again.", type: "error" });
    }
}