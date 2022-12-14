//dependencies and global variables 
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
require('dotenv').config()
let db,   
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'StoicQuotes'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology:true })
    .then(client => {
        console.log(`connected to ${dbName}`)
        db = client.db(dbName)
    })
    .catch(error => console.error(error))
app.set('view engine', 'ejs')
//middleware
app.use("/public", express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
    
//routes
app.get('/', (req,res) => {
    db.collection('quotes').find().toArray()
        .then(results => {
            res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
})

app.post('/quotes', (req,res) => {
    db.collection('quotes').insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/addlike', (req,res) => {
    db.collection('quotes').findOneAndUpdate(
        {quote: req.body.quote,
         name: req.body.name},
         {$set: {
            name: req.body.name,
            quote: req.body.quote,
            likes: req.body.likes,
         }}
    )
    .then(result => {
        console.log('Added One Like')
        res.json('Like Added')
    })
    .catch(error => console.error(error))
})


app.delete('/deletequote', (req,res) => {
    console.log(req.body)
    db.collection('quotes').deleteOne(
        {quote: req.body.quote,
         name: req.body.name},
    )
    .then(result => {
        console.log('deleted quote')
        res.json('quote deleted')
    })
    .catch(error => console.error(error))
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);