"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseAllSettledFilterFulfilled = exports.PromiseAllSettled = exports.sleep = void 0;
exports.sleep = (time = 0, throwError = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (throwError) {
                reject();
            }
            else {
                resolve();
            }
        }, time);
    });
};
// polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
exports.PromiseAllSettled = async (promises) => {
    return Promise.all(promises.map(p => p.then(v => {
        return { status: 'fulfilled', value: v };
    }, error => {
        return { status: 'rejected', reason: error };
    })));
};
exports.PromiseAllSettledFilterFulfilled = async (promises) => {
    const results = await exports.PromiseAllSettled(promises);
    return results
        .filter(r => r.status === `fulfilled`)
        .map(r => r.value);
};
//# sourceMappingURL=promise.js.map