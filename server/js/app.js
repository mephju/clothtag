/**
 * Entry point module. This is the module called by node in the cli.
 * It's only purpose is to configure Node, Jade and Express properly 
 * and to finally start the built-in http server. 
 */

var express = require('express')

var app = express()
var routes = require('./routes/routes')



app.set('views', __dirname + '/../views')
app.set('view engine', 'jade');
app.set('view options', {layout: false})

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});


app
	.use(express.logger('short'))
	.use(express.favicon())
	.use(express.bodyParser({
		uploadDir: '/tmp',
    	keepExtensions: true
	}))
	.use(express.static(__dirname + '/../../client'));

routes.setRoutesOn(app);

global.port = process.env.PORT || 3000;

app.listen(global.port, function() {
	console.log('clothtag listening on port ' + global.port)
})





