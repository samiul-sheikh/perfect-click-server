const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('DB connected successfully');
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orderService");
    const testimonialCollection = client.db(`${process.env.DB_NAME}`).collection("testimonials");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");

    app.get('/', (req, res) => {
        res.send('Welcome to Perfect Click server!')
    })

    // add services in server
    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
            .then((result) => {
                res.send(result.insertedCount > 0);
            });
    });

    // display all services from server in homepage
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    })

    // display service details in serviceInformation page 
    app.get('/service/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.find({ _id: id })
            .toArray((err, service) => {
                res.send(service[0])
            })
    })

    // display service information in Checkout page
    app.get('/service/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.find({ _id: id })
            .toArray((err, service) => {
                res.send(service[0])
            })
    })

    // store checkOut service information in database
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                // console.log(result)
                res.send(result.insertedCount > 0);
            })
        // console.log(newOrder);
    })

    // display all ordered services in all order list
    app.get('/allOrders', (req, res) => {
        orderCollection.find()
            .toArray((err, result) => {
                res.send(result);
            })
    })

    // display ordered services in Orders page for specific user
    app.get('/orders', (req, res) => {
        // console.log(req.query.email);
        orderCollection.find({ email: req.query.email })
            .toArray((err, result) => {
                res.send(result);
            })
    })

    // store testimonials information  to server
    app.post('/addTestimonial', (req, res) => {
        const newTestimonial = req.body;
        testimonialCollection.insertOne(newTestimonial)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // display testimonials dynamically in homepage
    app.get('/testimonials', (req, res) => {
        testimonialCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    // delete services from server and homepage
    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.findOneAndDelete({ _id: id })
            .then(items => res.send(!!items.value))
    })

    // new admin information store in server
    app.post("/makeAdmin", (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // display all admins
    app.get("/admins", (req, res) => {
        adminCollection.find({}).toArray((err, admins) => {
            res.send(admins);
        });
    });

    // delete admin from all
    app.delete('/deleteAdmin/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        adminCollection.findOneAndDelete({ _id: id })
            .then(items => res.send(!!items.value))
    })

    // update order status
    app.patch('/updateStatus', (req, res) => {
        const status = req.body.status
        orderCollection.updateOne({ _id: ObjectID(req.body.id) },
            {
                $set: { 'orders.status': status }
            }
        ).then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

});


app.listen(process.env.PORT || port)