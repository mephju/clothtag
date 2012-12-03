var express = require('express')

var app = express()
var routes = require('./js/routes/routes')

//app.register('.html', require('jade'));


app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.set('view options', {layout: false})

routes.setRoutesOn(app);

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log('clothtag listening on port ' + port)
})


