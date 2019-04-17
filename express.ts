import * as express from 'express';
import * as serveIndex from 'serve-index';
import { ws, dbconnect, dbdisconnect } from './ws';


export const port = 3000;

export const app = express();

app.use('/ws', ws);
app.use(express.static('www'));
app.use(serveIndex('www', { icons: true }));

export class Server {
    server;
    async start() {
        await dbconnect();
        this.server = app.listen(port, () => console.log('Server started on port', port));
    }

    async stop() {
        await dbdisconnect();
        this.server.close();
    }
}


