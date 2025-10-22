/// Wait
export async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const waitFor = (fn) => new Promise(resolve => {
    const check = () => fn() ? resolve() : setTimeout(check, 50);
    check();
});

export function waitForDOM() {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);

        } else {
            resolve();
        }
    });
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