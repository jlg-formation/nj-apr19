import * as express from 'express';
import { DBConnection } from './db';
import { sleep } from './misc';
import { ObjectId, UpdateWriteOpResult, DeleteWriteOpResultObject } from 'mongodb';
const app = express.Router();

const renameId = n => {
    n.id = n._id;
    delete n._id;
    return n;
};

export class RestDB {

    db = new DBConnection();

    expose(r: string) {
        const items = new Map();
        const collection = this.db.database.collection(r);

        const baseURL = `/${r}s?`;
        app.post(baseURL, async (req, res) => {
            const result = await collection.insertOne({ ...req.body });
            const user = { ...req.body, id: result.insertedId };
            await sleep(1000);
            return res.status(201).json(user);
        });

        app.get(baseURL, async (req, res) => {
            const array = await collection.find({}).toArray();
            array.forEach(renameId);
            return res.json(array);
        });

        app.get(baseURL + '/:id', async (req, res) => {
            const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
            if (!result) {
                return res.status(404).end();
            }
            return res.json(renameId(result));
        });

        app.put(baseURL + '/:id', async (req, res) => {

            try {
                const id = new ObjectId(req.params.id);
                delete req.body.id;
                const updateWriteOpResult: UpdateWriteOpResult = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, req.body);
                if (updateWriteOpResult.result.n === 0) {
                    return res.status(404).end();
                }
                return res.status(204).end();
            } catch (err) {
                return res.status(404).end();
            }
        });

        app.patch(baseURL + '/:id', async (req, res) => {
            try {
                const id = new ObjectId(req.params.id);
                delete req.body.id;
                const updateWriteOpResult: UpdateWriteOpResult = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
                if (updateWriteOpResult.result.n === 0) {
                    return res.status(404).end();
                }
                return res.status(204).end();
            } catch (err) {
                return res.status(404).end();
            }
        });

        app.patch(baseURL, async (req, res) => {
            try {
                await collection.updateMany({}, { $set: req.body });
                return res.status(204).end();
            } catch (err) {
                return res.status(404).end();
            }
        });

        app.delete(baseURL, async (req, res) => {
            const result = await collection.deleteMany({});
            return res.status(204).end();
        });

        app.delete(baseURL + '/:id', async (req, res) => {
            try {
                const id = new ObjectId(req.params.id);
                const result: DeleteWriteOpResultObject = await collection.deleteOne({ _id: id });
                if (result.result.n === 0) {
                    return res.status(404).end();
                }
                return res.status(204).end();
            } catch (err) {
                return res.status(404).end();
            }
        });
        return app;
    }

}

