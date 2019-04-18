import * as crypto from 'crypto';

import * as cluster from 'cluster';
import * as os from 'os';
const numCPUs = os.cpus().length;

const myString = "Engie";

function sha1(str: string): string {
    const shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}

function myWorker(myString: string, offset: number, modulo: number): string {
    let i = offset;
    while (true) {
        if (sha1(myString + i).startsWith('00000000')) {
            break;
        }
        i += modulo;
    }
    return '' + i;
}

if (cluster.isMaster) {
    console.time('miner');
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    const workers = new Array(numCPUs).fill(0).map((n, i) => cluster.fork({
        offset: i
    }));

    // workers.forEach((worker, i) => worker.send({
    //     msg: 'coucou' + i
    // }));

    workers.forEach(worker => worker.on('message', (msg) => {
        console.log('msg', msg);
        console.log('sha1', sha1(myString + msg));

        console.timeEnd('miner');
        process.exit(0);
    }));

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {
    // console.log(`Worker ${process.pid} started`);
    // process.on('message', (...args) => {
        // console.log('I received the message: ', args);
        const offset = +process.env.offset;
        const str = myWorker(myString, offset, numCPUs);
        process.send(str);
    // });
}

