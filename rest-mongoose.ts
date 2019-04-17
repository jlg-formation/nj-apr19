import * as express from "express";
import * as mongoose from "mongoose";
const app = express.Router();


const models = {
    user: mongoose.model("user",
        new mongoose.Schema({
            name: { type: String, required: true, unique: true },
            age: Number,
        }, { strict: false })),
    bus: mongoose.model("bus",
        new mongoose.Schema({
            immatriculation: { type: String, required: true, unique: true },
            brand: { type: String },
        }, { strict: false })),
};

class DBConnection {
    async connect() {
        try {
            await mongoose.connect("mongodb://localhost:27017/NJ",
                { useNewUrlParser: true, useCreateIndex: true, });

            console.log("Connected successfully to MongoDB");
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    }

    async disconnect() {
        await mongoose.connection.close();
    }
}

export const normalize = (o: any) => {
    o.id = o._id;
    for (const p in o) {
        if (p.startsWith("_")) {
            delete o[p];
        }
    }
    return o;
};

export class RestMongoose {

    db = new DBConnection();

    expose(r: string) {

        const baseURL = `/${r}s?`;
        app.post(baseURL, async (req, res) => {
            try {
                const obj = new models[r](req.body);
                const result = await obj.save();
                return res.status(201).json(normalize(result.toObject()));
            } catch (err) {
                if (err instanceof mongoose.Error.ValidationError) {
                    return res.status(400).json({ error: err.message });
                }
                if (err.constructor.name === "MongoError" && err.code === 11000) {
                    return res.status(400).json({ error: err.message });
                }
                return res.status(500).json({ error: err, type: err.constructor.name });
            }
        });

        // app.get(baseURL, async (req, res) => {
        //     const array = await collection.find({}).toArray();
        //     array.forEach(renameId);
        //     return res.json(array);
        // });

        // app.get(baseURL + "/:id", async (req, res) => {
        //     const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
        //     if (!result) {
        //         return res.status(404).end();
        //     }
        //     return res.json(renameId(result));
        // });

        // app.put(baseURL + "/:id", async (req, res) => {

        //     try {
        //         const id = new ObjectId(req.params.id);
        //         delete req.body.id;
        //         const updateWriteOpResult: UpdateWriteOpResult =
        //             await collection.replaceOne({ _id: new ObjectId(req.params.id) }, req.body);
        //         if (updateWriteOpResult.result.n === 0) {
        //             return res.status(404).end();
        //         }
        //         return res.status(204).end();
        //     } catch (err) {
        //         return res.status(404).end();
        //     }
        // });

        // app.patch(baseURL + "/:id", async (req, res) => {
        //     try {
        //         const id = new ObjectId(req.params.id);
        //         delete req.body.id;
        //         const updateWriteOpResult: UpdateWriteOpResult =
        //             await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
        //         if (updateWriteOpResult.result.n === 0) {
        //             return res.status(404).end();
        //         }
        //         return res.status(204).end();
        //     } catch (err) {
        //         return res.status(404).end();
        //     }
        // });

        // app.patch(baseURL, async (req, res) => {
        //     try {
        //         await collection.updateMany({}, { $set: req.body });
        //         return res.status(204).end();
        //     } catch (err) {
        //         return res.status(404).end();
        //     }
        // });

        // app.delete(baseURL, async (req, res) => {
        //     const result = await collection.deleteMany({});
        //     return res.status(204).end();
        // });

        // app.delete(baseURL + "/:id", async (req, res) => {
        //     try {
        //         const id = new ObjectId(req.params.id);
        //         const result: DeleteWriteOpResultObject = await collection.deleteOne({ _id: id });
        //         if (result.result.n === 0) {
        //             return res.status(404).end();
        //         }
        //         return res.status(204).end();
        //     } catch (err) {
        //         return res.status(404).end();
        //     }
        // });
        return app;
    }

}

