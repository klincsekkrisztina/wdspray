var fs = require('fs')
var createHTML = require('create-html')
 
var html = createHTML({
  title: 'example'
})
 
fs.writeFile('index.html', html, function (err) {
  if (err) console.log(err)
})