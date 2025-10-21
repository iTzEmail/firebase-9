export const SESSION_CONFIG = {
    idleDuration: 10 * 60 * 1000, // 10 minutes
    maxSessionDuration: 60 * 60 * 1000, // 1 hour, optimal
}

export const PUBLIC_PAGES = ['', 'home', 'login', 'register', 'reset']

export const ERRORS = {
    REGISTER: {
        "auth/email-already-in-use": "User already exists",
        "auth/invalid-email": "Invalid email address",
        "auth/weak-password": "Password is too weak",
        "auth/network-request-failed": "Network error, please try again",
    },
    CHECK_EMAIL: {
        "auth/too-many-requests": "Please wait before trying again."
    }
}


// Pages
export const HOME = {
    playerDefaults: {autoplay: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0, disablekb: 1, fs: 0, loop: 1, mute: 1},
    vids: [
        { videoId: 'M-PcjpkS7OY', startSeconds: 77, endSeconds: 130, suggestedQuality: 'hd720' },
        { videoId: 'W_14QhYt-O4', startSeconds: 45, endSeconds: 100, suggestedQuality: 'hd720' },
    ]
}

export const REGISTER = {
    required: {
        length: { regex: /.{15,}/, text: "At least 15 characters" },
        upper: { regex: /[A-Z]/, text: "One uppercase letter" },
        lower: { regex: /[a-z]/, text: "One lowercase letter" },
        number: { regex: /\d/, text: "One number" },
        special: { regex: /[!@#$%^&*(),.?\":{}|<>_\\-]/, text: "One special character" },
    }
}