// const sleep = time => new Promise(r => setTimeout(r, 0));

// (async () => {
//     for (let i = 0; i < 100000; i++) {
//         await sleep(0);
//         const a = 0 + 0;
//     }
//     console.log(process.uptime());
// })();

function iDoSomething(a, b, callback) {
    setTimeout(() => {
        callback(undefined, a + b, a * b);
    }, 1000);
}

iDoSomething(1, 2, (err, add, mult) => {
    if (err) {
        console.error('error', err);
        return;
    }
    console.log('add', add);
    console.log('mult', mult);
});

const iDoSomethingPromise = promisify(iDoSomething);

iDoSomethingPromise(3, 4).then(([add, mult]) => {
    console.log('add', add);
    console.log('mult', mult);
});

function promisify(asyncFn) {
    const asyncFnPromise = (...args) => new Promise((resolve, reject) => {
        asyncFn(...args, (err, ...result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
    return asyncFnPromise;
}

function hybridify(asyncFn) {
    const promise = promisify(asyncFn);
    return (...args) => {
        if (typeof args[args.length - 1] !== "function") {
            return promise(...args);
        }
        return asyncFn(...args);
    }
}

const iDoSomethingHybride = hybridify(iDoSomething);

iDoSomethingHybride(5,6).then(([add, mult]) => {
    console.log('add', add);
    console.log('mult', mult);
});

iDoSomethingHybride(7, 8, (err, add, mult) => {
    if (err) {
        console.error('error', err);
        return;
    }
    console.log('add', add);
    console.log('mult', mult);
});


(async() => {
    const [add, mult] = await iDoSomethingHybride(9, 10);
    console.log('add', add);
    console.log('mult', mult);
})();