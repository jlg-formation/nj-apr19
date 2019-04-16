import * as express from 'express';
const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded());

let id = 0;
const generateId = () => id++;

const users = [];


app.get('/clock', (req, res) => res.json({ time: new Date() }));


app.post('/users?', (req, res) => {
    const user = { ...req.body, id: generateId() };
    users.push(user);
    res.status(201).json(user);
});

app.get('/users?', (req, res) => res.json(users));
