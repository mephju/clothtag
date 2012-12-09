var express = require('express')

var app = express()
var routes = require('./js/routes/routes')

//app.register('.html', require('jade'));


app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.set('view options', {layout: false})

app.use(express.bodyParser({
	uploadDir: '/tmp',
    keepExtensions: true
}))

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/client'));

routes.setRoutesOn(app);

global.port = process.env.PORT || 5000;

app.listen(global.port, function() {
	console.log('clothtag listening on port ' + global.port)
})





