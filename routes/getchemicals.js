var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://klincsekkrisztina:insomnia@cluster0.lac4v.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/* GET chemicals listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with chemicals');

// });

/************ READE ****************/

router.get('/', function (req, res) {
  client.connect(err => {
    client
      .db("wdspray_app")
      .collection("wdspray")
      .find()
      .toArray()
      .then(chemicals => {
      	makeHtmlContent(chemicals);
      	// console.log(chemicals);
        res.send('respond with chemicals');
      });
  });
});



function makeHtmlContent(chemicals) {
	let body = ``;
	
	chemicals.map((chemical) => {
		body+= `<h1>${chemical.title}</h1>
							<div>
								<ul>`;
		str = "";
		chemical.properties.map((property) => {
			str += `<li>${property}</li>`
		})
		body += str
		str = "";

		//folytatni a tömb map-ekkel

		console.log(body);
		console.log("ide jön a createHTML")
		body = "";
		
	});

};

module.exports = router;
