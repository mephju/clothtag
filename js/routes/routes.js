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
			if(err) {
				res.render('error')
			} else {
				console.log(getHostAndPort(req))
				res.render('image', {
					title: image.title,
					fname: 'http://www.clothtag.99k.org/' + image.filename
				})
			}
		})

				
	})






	app.post('/images', function(req, res, next) {

		console.log('uploading new image')

		console.log(req.files)
		
		var store = {
			path: req.files.image.path,
			title: req.body.title
		}

		data.addImage(store, function(err, newStore) {
			console.log('add image onDonbe')
			
			var splits = newStore.path.split('/');
			var fname = splits[splits.length-1]

			if(err) {
				res.redirect('/asdfadsf')
			} else {
				res.redirect('/images/' + fname)
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