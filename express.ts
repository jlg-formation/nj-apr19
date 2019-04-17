import * as express from "express";
import * as http from "http";
import * as serveIndex from "serve-index";

import { dbconnect, dbdisconnect, ws } from "./ws";

export const port = 3000;
export const app = express();

const listenPromise = (port: number): Promise<http.Server> => new Promise(resolve => {
    const server = http.createServer(app);
    server.listen(port, () => {
        resolve(server);
    });
});

app.use("/ws", ws);
app.use(express.static("www"));
app.use(serveIndex("www", { icons: true }));

export class MyServer {
    public httpServer: http.Server;
    public async start() {
        await dbconnect();
        this.httpServer = await listenPromise(port);
        console.log("Server started on port", port);
    }

    public async stop() {
        await dbdisconnect();
        this.httpServer.close();
    }
}
