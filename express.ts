import * as express from 'express';
import * as serveIndex from 'serve-index';
import { ws } from './ws';

export const port = 3000;

export const app = express();
app.use('/ws', ws);
app.use(express.static('www'));
app.use(serveIndex('www', { icons: true }));

