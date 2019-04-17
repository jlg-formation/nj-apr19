import * as express from 'express';
import { RestDB } from './rest-db';
export const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    setTimeout(next, 0);
});


app.get('/clock', (req, res) => res.json({ time: new Date() }));

const resources = ['user', 'bus'];
(async () => {
    const rest = new RestDB();
    await rest.db.connect();
    resources.forEach(r => app.use(rest.expose(r)));
})();

