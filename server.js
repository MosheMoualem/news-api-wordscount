const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8081;
const router = require('./api');

const db = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);


const run = async () => {
    try {
        await db.connect();
        app.listen(port, () => console.log(`server listening on port ${port}!`));
    } finally {
        await db.disconnect();
    }
}

run().catch(console.dir);





