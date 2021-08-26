const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/perfectClick?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('DB connected successfully');
    const serviceCollection = client.db("perfectClick").collection("services");

    // add services in server
    app.post('/addService', (req, res) => {
        const newService = req.body;
        // console.log('adding new service: ', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                // console.log('inserted count ', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // display services from server
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
                // console.log('from database', services)
            })
    })

    // display service information in ui
    // app.get('/service/:id', (req, res) => {
    //     const id = ObjectID(req.params.id);
    //     serviceCollection.find({_id: id})
    //         .toArray((err, services) => {
    //             // res.send(service[0])
    //             console.log('from database', services[0])
    //         })
    // })

});


app.get('/', (req, res) => {
    res.send('Welcome to Perfect Click server!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})