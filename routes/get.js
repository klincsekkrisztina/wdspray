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


//GET chemical list
router.get('/chemicallist', function (req, res, next) {
  client.connect(err => {
    client
      .db("wdspray_app")
      .collection("wdspray")
      .find()
      .toArray()
      .then(chemicals => {
        // console.log(chemicals);
        res.send(chemicals);
      });
  });
});


//GET chemicals and create JSON files from all
router.get('/json', function (req, res, next) {
  client.connect(err => {
    client
      .db("wdspray_app")
      .collection("wdspray")
      .find()
      .project({ _id: 0 })
      .toArray()
      .then(chemicals => {
        makeJsonFiles(chemicals);
        res.send("respond with chemicals, JSON files made");
      });
  });
});

function makeJsonFiles(chemicals) {
  chemicals.map((chemical) => {
    let jsonContent = JSON.stringify(chemical); 

    //make file name: remove accents, 
    str = `./json/${chemical.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '').toLowerCase()}.json`
    console.log(str);

    fs.writeFile(str, jsonContent, function (err) {
      if (err) console.log(err)
    })  
    jsonContent = "";
  })
}



module.exports = router;