const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const { response } = require('express');
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
    const orderCollection = client.db("FitnessFreakDB").collection("order");
    const usersCollection = client.db("FitnessFreakDB").collection("users");
    const adminsCollection = client.db("FitnessFreakDB").collection("admins");
    console.log('connected')

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/service/:id', (req, res) => {
        const id = req.params.id;
        serviceCollection.find({ _id: ObjectId(id) })
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

    app.get('/adminRole/:email', (req, res) => {
        const mail = req.params;
        adminsCollection.find({email : mail.email})
        .toArray((err,document) => {
            res.send(document[0])
        })
    })

    app.get('/services',(req,res) => {
        serviceCollection.find({})
        .toArray((err,document) => {
            res.send(document);
        })
    })
    
    app.patch('/updateOrder/:id',(req,res) => {
        const id = req.params.id;
        const status = req.body.order;
        console.log(status,id)
        orderCollection.updateOne({ _id: ObjectId(id)},{
            $set : {orderStatus : status}
        })
        .then(result => console.log(result))
    })

    app.post('/orders', (req, res) => {
        const email = req.body.mail;
        adminsCollection.find({ email: email })
            .toArray((err, adminProfile) => {
                const filter = {}
                if (adminProfile.length === 0) {
                    filter.email = email;
                }
                orderCollection.find(filter)
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            })
    })

    app.post('/addOrder', (req, res) => {
        const doc = req.body;
        orderCollection.insertOne(doc)
            .then(result => {
                console.log(result)
                res.send('Order created successfully')
            })
    })

    app.post('/addService', (req, res) => {
        const doc = req.body;
        serviceCollection.insertOne(doc)
            .then(result => console.log(result))
    })

    app.post('/addReview', (req, res) => {
        const doc = req.body;
        reviewCollection.insertOne(doc)
            .then(result => console.log(result))
    })

    app.post('/addAdmin', (req, res) => {
        const doc = req.body;
        adminsCollection.insertOne(doc)
            .then(result => {
                console.log(result);
                res.send('Admin added successfully')
            })
    })

    app.post('/addUser', (req, res) => {
        const doc = req.body;
        usersCollection.find({ email: doc.email })
            .toArray((err, documents) => {
                if (documents.length === 0) {
                    usersCollection.insertOne(doc)
                        .then(result => console.log(result))
                }
                else{
                    console.log('exists')
                }
            })

    })

    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            console.log(result);
            res.send("Deleted");
        })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})