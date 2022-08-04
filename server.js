//dependencies and global variables 
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const PORT = 4444
const app = express()
require('dotenv').config()

app.set('view engine', 'ejs')
//middleware
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

let db,   
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'StoicQuotes'
    

MongoClient.connect(dbConnectionStr, { useUnifiedTopology:true })
    .then(client => {
        console.log(`connected to ${dbName}`)
        db = client.db(dbName)
    })
    .catch(error => console.error(error))


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









app.listen(process.env.PORT || PORT, function() {
    console.log(`listening on ${PORT}`)
  })