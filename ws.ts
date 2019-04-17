import * as express from 'express';
import { Rest } from './rest';
const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    setTimeout(next, 100);
});


app.get('/clock', (req, res) => res.json({ time: new Date() }));

const resources = ['user', 'bus'];
const rest = new Rest();
resources.forEach(r => app.use(rest.expose(r)));
