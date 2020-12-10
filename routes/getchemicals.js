var express = require('express');
var router = express.Router();

var fs = require('fs')
var createHTML = require('create-html')

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://klincsekkrisztina:insomnia@cluster0.lac4v.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


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
        res.send('respond with chemicals');
      });
  });
});



function makeHtmlContent(chemicals) {
	let body = ``;
	let propertyList = ""; 
	let plantList = "";
	let componentList = "";
	
	//Iterate chamicals and map to html structure 
	chemicals.map((chemical) => {

		//map the Properties array to html structure, 						
		propertyList = "";
		chemical.properties.map((property) => {
			propertyList += `<li>${property}</li>`
		});

		//map the Plants array to html structure
		chemical.plants.map((plant) => {
			values = Object.values(plant);
			plantTds = "<tr>"
			for (value of values) {
				plantTds += "<td>" + value + "</td>";
			}
			plantTds += "</tr>"
			plantList += plantTds;
		})

		//map the Components array to html structure
		chemical.components.map((component) => {
			values = Object.values(component);
			componentTds = "<tr>"
			for (value of values) {
				componentTds += "<td>" + value + "</td>";
			}
			componentTds += "</tr>"
			componentList += componentTds;
		})



		body+= `<h1>${chemical.title}</h1>
							<div>
								<ul>
								${propertyList}
								</ul>
							</div>
							<div>
								<table>
									<tr>
										<th>Növényi kultúra</th>
										<th>Károsító</th>
										<th>Dózis</th>
										<th>Mértékegység</th>
										<th>Felhasználási javaslat</th>
										<th>ÉVI (nap)</th>
									</tr>
									${plantList}
								</table>
							</div>
							<div>
								<table>
									<tr>
										<th>Hatóanyag</th>
										<th>Koncentráció (g/l)</th>
										<th>Koncentráció (m/m%)</th>
									</tr>
									${componentList}
								</table>
							</div>`;


		//Create HTML file
		let html = createHTML({
		  title: chemical.title,
  		head: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  		body: body,
		})

		//make file name: remove accents, 
		str = `./html/${chemical.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '').toLowerCase()}.html`
		console.log(str);

		fs.writeFile(str, html, function (err) {
		  if (err) console.log(err)
		})

		str = "";
		propertyList = "";
		plantList = "";
		body = "";
		
	});

};

module.exports = router;
