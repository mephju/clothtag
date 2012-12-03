var data = require('../model/data')

exports.setRoutesOn = function(app) {
	app.get('/', function(req, res, next) {
		res.render('index', {
			title: "Clothtag App "
		})
	})

	app.get('/images/:searchkey', function(req, res, next) {
		res.render('images', {
			title: "Clothtag App "
		})
	})


	app.get('/image:id', function(req, res, next) {
		res.render('image', {
			title: "Clothtag App "
		})
	})


	app.post('/image', function(req, res, next) {
		res.render('image', {
			title: "Clothtag App "
		})
	})


	app.put('/image:id', function(req, res, next) {
		res.render('image', {
			title: "Clothtag App "
		})
	})
}