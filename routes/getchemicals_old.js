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
	
	//Iterate chamicals and map to html structure 
	chemicals.map((chemical) => {
		body+= `<h1>${chemical.title}</h1>
							<div>
								<ul>`;

		//map the Properties array to html structure						
		str = "";
		chemical.properties.map((property) => {
			str += `<li>${property}</li>`
		})
		body += str
		str = "";

		//add some static html structure
		body += 	`</ul>
						</div>
						<div>
							<table>
								<tr>
									<th>Növényi kultúra</th>
									<th>Dózis</th>
									<th>Mértékegység</th>
									<th>Felhasználási javaslat</th>
									<th>ÉVI (nap)</th>
								</tr>`;


		//map the Plants array to html structure
		chemical.plants.map((plant) => {
			values = Object.values(plant);
			tds = "<tr>"
			for (value of values) {
				tds += "<td>" + value + "</td>";
			}
			tds += "</tr>"
			str += tds;
		})
		body += str
		str = "";


		//add further static html structure
		body += `	</table>
						</div>
						<div>
							<table>
								<tr>
									<th>Hatóanyag</th>
									<th>Koncentráció (g/l)</th>
									<th>Koncentráció (m/m%)</th>
								</tr>`;

		
		//map the Components array to html structure
		chemical.components.map((component) => {
			values = Object.values(component);
			tds = "<tr>"
			for (value of values) {
				tds += "<td>" + value + "</td>";
			}
			tds += "</tr>"
			str += tds;
		})
		body += str

		//add further static html structure
		body += `	</table>
						</div>`


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
		body = "";
		
	});

};

module.exports = router;
