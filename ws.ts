import * as express from 'express';
const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded());

let id = 0;
const generateId = (): number => id++;

const users = new Map();


app.get('/clock', (req, res) => res.json({ time: new Date() }));


app.post('/users?', (req, res) => {
    const id = generateId();
    const user = { ...req.body, id };
    users.set(id, user);
    res.status(201).json(user);
});

app.get('/users?', (req, res) => res.json(Array.from(users.values())));

app.get('/users?/:id', (req, res) => {
    if (!users.has(+req.params.id)) {
        return res.status(404).end();
    }
    return res.json(users.get(+req.params.id));
});

app.delete('/users?', (req, res) => {
    users.clear();
    return res.status(204).end();
});
