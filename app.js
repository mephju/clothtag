var express = require('express')

var app = express()
var routes = require('./js/routes')

//app.register('.html', require('jade'));


app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.set('view options', {layout: false})

routes.setRoutesOn(app);

app.listen(3000, function() {
	console.log('clothtag listening on port 3000')
})


