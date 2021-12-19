const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ou7jc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Aqua_DB');
        const productsCollection = database.collection('fishes');

        app.get('/products' ,async (req, res)=>{
                const cursor = productsCollection.find({});
                const fishes = await cursor.toArray();
                res.json(fishes);

        })

        app.get('/products/:id', async (req, res) => {
            const _id = req.params.id;
            console.log(_id);
            const query = { _id: ObjectId(_id) };
            const result = await productsCollection.findOne(query);
            res.json(result);
          })
       
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Aqua server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})