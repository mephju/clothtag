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

app.use(express.bodyParser({
	uploadDir: '/tmp',
    keepExtensions: true
}))

app.use(express.static(__dirname + '/../../client'));

routes.setRoutesOn(app);

global.port = process.env.PORT || 3000;

app.listen(global.port, function() {
	console.log('clothtag listening on port ' + global.port)
})





