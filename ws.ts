import * as express from "express";
import { RestMongoose } from "./rest-mongoose";
export const app = express.Router();
export const ws = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    setTimeout(next, 0);
});

app.get("/clock", (req, res) => res.json({ time: new Date() }));

const resources = ["user", "bus"];

const rest = new RestMongoose();

export const dbconnect = async () => {
    await rest.db.connect();
    resources.forEach(r => app.use(rest.expose(r)));
};

export const dbdisconnect = async () => {
    await rest.db.disconnect();
};

