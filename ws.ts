import * as express from 'express';
const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded());

let privateId = 0;
const generateId = (): number => privateId++;

const users = new Map();


app.get('/clock', (req, res) => res.json({ time: new Date() }));


app.post('/users?', (req, res) => {
    const id = generateId();
    const user = { ...req.body, id };
    users.set(id, user);
    return res.status(201).json(user);
});

app.get('/users?', (req, res) => res.json(Array.from(users.values())));

app.get('/users?/:id', (req, res) => {
    if (!users.has(+req.params.id)) {
        return res.status(404).end();
    }
    return res.json(users.get(+req.params.id));
});

app.put('/users?/:id', (req, res) => {
    const id = +req.params.id;
    if (!users.has(id)) {
        return res.status(404).end();
    }
    users.set(id, { ...req.body, id });
    return res.status(204).end();
});

app.patch('/users?/:id', (req, res) => {
    const id = +req.params.id;
    if (!users.has(id)) {
        return res.status(404).end();
    }
    users.set(id, { ...users.get(id), ...req.body, id });
    return res.status(204).end();
});

app.delete('/users?', (req, res) => {
    users.clear();
    return res.status(204).end();
});

app.delete('/users?/:id', (req, res) => {
    if (!users.has(+req.params.id)) {
        return res.status(404).end();
    }
    users.delete(+req.params.id);
    return res.status(204).end();
});
