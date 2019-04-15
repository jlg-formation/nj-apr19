import * as express from 'express';
const app = express.Router();
export const ws = app;


app.get('/clock', (req, res) => res.json({ time: new Date() }));


