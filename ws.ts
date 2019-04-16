import * as express from 'express';
const app = express.Router();
export const ws = app;

const users = [];


app.get('/clock', (req, res) => res.json({ time: new Date() }));


app.post('/user', (req, res) => {
    ;
    res.json({});
});
