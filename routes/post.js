var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

var fs = require('fs')
// var createHTML = require('create-html')

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://klincsekkrisztina:insomnia@cluster0.lac4v.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//POST image (base64 encoded string), find document by _id in db and ipdate "img" witn base64 string

router.post('/uploadimage', function (req, res, next) {
  const ObjectID = require('mongodb').ObjectID;
  client.connect(err => {
    client
      .db("wdspray_app")
      .collection("wdspray")
      .updateOne(
        { "_id": ObjectID(req.body._id) }, //Filter
        { $set: {"img": req.body.base64}}  //Update
        )
      .then(chemical => {
        res.send(req.body);
      });
  });
});


module.exports = router;