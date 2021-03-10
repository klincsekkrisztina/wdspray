var express = require('express');
var router = express.Router();

var fs = require('fs')
// var createHTML = require('create-html')

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://klincsekkrisztina:insomnia@cluster0.lac4v.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//POST image (base64 encoded string), find document by _id in db and insert string
router.post('/uploadimage', function (req, res, next) {
  client.connect(err => {
    client
      .db("wdspray_app")
      .collection("wdspray")
      .find({"_id": req._id} )
      .toArray()
      .then(chemical => {
        console.log(chemical);
        res.send("ok");
      });
  });
});





module.exports = router;