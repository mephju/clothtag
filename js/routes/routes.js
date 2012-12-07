var data = require('../model/data')

exports.setRoutesOn = function(app) {
	app.get('/', function(req, res, next) {
		res.render('index', {
			title: "Clothtag App "
		})
	})

	app.get('/images/new', function(req, res, next) {
		res.render('images/new', {
			title:"Upload New Image",

		})
	})

	app.get('/images/search/:searchkey', function(req, res, next) {
		res.render('image', {
			title: "Clothtag App "
		})
	})



	app.get('/images/:id', function(req, res, next) {

		data.getImage(req.params.id, function(err, image) {
			if(err) res.render('error')
			else {

				console.log(getHostAndPort(req))
				res.render('image', {
					title: image.title,
					fname: 'http://' + getHostAndPort(req) + '/uploads/' + image.filename
				})
			}
		})

				
	})






	app.post('/images', function(req, res, next) {

		console.log('uploading new image')

		console.log(req.files)
		//console.log(req.body)
		var filePathChunks = req.files.image.path.split('/')
		
		var store = {
			filename: filePathChunks[filePathChunks.length -1],
			title: req.body.title
		}

		data.addImage(store, function(err, newStore) {
			if(err) {
				res.redirect('/asdfadsf')
			} else {
				res.redirect('/images/' + newStore.filename)
			}
		})
	
		
	})


	app.get('*', function(req, res){
  		res.send(404);
	});
}


var getHostAndPort = function(req) {
	return req.header('host')
}