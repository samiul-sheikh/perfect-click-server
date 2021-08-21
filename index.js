const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/perfectClick?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("perfectClick").collection("services");
    console.log('DB connected successfully');

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new service: ', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // display services from server
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
                console.log('from database', services)
            })
    })

});


app.get('/', (req, res) => {
    res.send('Welcome to Perfect Click server!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})