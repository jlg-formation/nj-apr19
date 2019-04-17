import * as express from 'express';
import { DBConnection } from './db';
import { InsertOneWriteOpResult } from 'mongodb';
const app = express.Router();

export class RestDB {

    db = new DBConnection();

    expose(r: string) {
        const items = new Map();
        const collection = this.db.database.collection(r);

        const baseURL = `/${r}s?`;
        app.post(baseURL, async (req, res) => {
            const result: InsertOneWriteOpResult = await collection.insertOne({ ...req.body });
            const user = { ...req.body, id: result.insertedId };
            return res.status(201).json(user);
        });

        app.get(baseURL, (req, res) => res.json(Array.from(items.values())));

        app.get(baseURL + '/:id', (req, res) => {
            if (!items.has(+req.params.id)) {
                return res.status(404).end();
            }
            return res.json(items.get(+req.params.id));
        });

        app.put(baseURL + '/:id', (req, res) => {
            const id = +req.params.id;
            if (!items.has(id)) {
                return res.status(404).end();
            }
            items.set(id, { ...req.body, id });
            return res.status(204).end();
        });

        app.patch(baseURL + '/:id', (req, res) => {
            const id = +req.params.id;
            if (!items.has(id)) {
                return res.status(404).end();
            }
            items.set(id, { ...items.get(id), ...req.body, id });
            return res.status(204).end();
        });

        app.patch(baseURL + '/:id', (req, res) => {
            items.forEach((v, k, map) => {
                map.set(k, { ...map.get(k), ...req.body, id: k });
            });
            return res.status(204).end();
        });

        app.delete(baseURL, (req, res) => {
            items.clear();
            return res.status(204).end();
        });

        app.delete(baseURL + '/:id', (req, res) => {
            if (!items.has(+req.params.id)) {
                return res.status(404).end();
            }
            items.delete(+req.params.id);
            return res.status(204).end();
        });
        return app;
    }

}

