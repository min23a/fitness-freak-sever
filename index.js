const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@minibytes.dgx5f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Working!!!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("FitnessFreakDB").collection("services");
    const reviewCollection = client.db("FitnessFreakDB").collection("reviews");
    console.log('connected')
    app.get('/services',(req,res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.post('/addService',(req,res) => {
        const doc = req.body;
        serviceCollection.insertOne(doc)
        .then(result => console.log(result))
    })
    app.post('/addReview', (req, res) => {
        const doc = req.body;
        reviewCollection.insertOne(doc)
            .then(result => console.log(result))
    })
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})