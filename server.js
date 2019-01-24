const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient


var db
MongoClient.connect('mongodb://Jacques:Jacques01@ds253840.mlab.com:53840/colors', (err, client) => {
  if (err) return console.log(err)
   db = client.db('colors')
   app.listen(3000, () => {
     console.log('listening on 3000')
   })
   app.get('/', (req, res) => {
     var cursor = db.collection('colors').find()
   })
   db.collection('colors').find().toArray(function(err, result) {
     console.log(result)
   })
 })

 app.get('/', (req, res) => {
   db.collection('colors').find().toArray((err, result) => {
     if (err) return console.log(err)
     res.render('index.ejs', {colors: result})
   })
 })

 app.post('/colors', (req, res) => {
   db.collection('colors').find().toArray(function(err,result){
     var num = result.length+1
     var colors = req.body.colors
     var name = req.body.user
     db.collection('colors').insertOne({name:name, colors:colors, num:num})
     console.log(result)
     res.redirect('/')
   })
})

app.post('/delete', function(req, res) {
  var num = parseInt(req.body.buttonNum)
  console.log(num)
  db.collection("colors").deleteOne({num:num})
  res.redirect("/")
})


app.post('/update', (req,res) => {
  var num = parseInt(req.body.buttonNum2)
  db.collection('colors').find({num:num}).toArray(function(err,result){
    var num2 = parseInt(req.body.buttonNum2)
    console.log(result)
    var colors = result[0].colors
    var name = result[0].name
    res.render('edit.ejs', {name:name, colors:colors, editNum:num2})
   })
});

app.post('/update2', function(req, res) {
  var updateColor = req.body.colors
  var Num = parseInt(req.body.editNum)
  var addedName = req.body.user

  console.log(Num)
  db.collection('colors').updateOne({num:Num},
      { $set: {name:addedName, colors: updateColor}},
       (err, res) => {
      if (err) throw err;
      console.log("updated");
    })
    res.redirect('/');
});
