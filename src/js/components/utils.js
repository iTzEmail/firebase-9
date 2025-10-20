/// Wait
export async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/// Throttle
export const throttle = (fn, delay = 300) => {
    let lastExecutedAt = 0;
    return function (...args) {
        const context = this;
        const now = Date.now();
        if (now - lastExecutedAt >= delay) {
            fn.call(context, ...args);
            lastExecutedAt = now;
        }
    }
}