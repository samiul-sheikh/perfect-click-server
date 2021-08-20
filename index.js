
const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/perfectClick?retryWrites=true&w=majority`;
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("perfectClick").collection("bookings");
    console.log('DB connected successfully');
    client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})