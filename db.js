const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

class db {
    constructor() {
        this.connection = null;
    }

    async connect() {
        this.connection = new MongoClient('mongodb://localhost:27017');
        await this.connection.connect();
        // check connectivity - just for fun
        this.connection.db('admin').command({ ping: 1 });
    }

    async disconnect() {
        await client.close();
    }
}

// save single instance
module.exports = new db();