import { MongoClient, Db } from "mongodb";

// connect to Mongo

export class DBConnection {
    client: MongoClient;
    database: Db;
    async connect() {
        try {
            const c = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });

            console.log('Connected successfully to MongoDB');
            this.client = c;
            this.database = c.db('NJ');
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }

    }
}



