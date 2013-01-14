var data = require('../model/data')

exports.setRoutesOn = function(app) {
	app.get('/', function(req, res, next) {
		
		console.log("GET /")

		data.getImages(function(err, images) {
			if(err) {
				console.log(err)
				res.redirect('aasdfasdf')
			} else {
				res.render('index', {
					title: "Recent Images",
					images: images,
					template: 'index'
				})		
			}
		})	
	})

	app.get('/images/new', function(req, res, next) {

		console.log("GET /images/new")

		res.render('images/new', {
			title:"Upload New Image",
			template:'images/new'
		})
	})

	app.get('/images/search/:searchkey', function(req, res, next) {

		console.log("GET /images/search/:searchkey")

		res.render('image', {
			title: "Clothtag App "
		})
	})



	app.get('/images/:id', function(req, res, next) {

		console.log("GET /images/:id")

		data.getImage(req.params.id, function(err, imageRec) {
			if(err) {
				res.render('error')
			} else {
				
				if(imageRec.length) {

					var image = imageRec[0]
					var tags = new Array()
					imageRec.forEach(function(elem) {
						if(elem.title_tag && elem.link && elem.tag_x && elem.tag_y) {
							var tag = {}

							tag.title_tag = elem.title_tag
							tag.link = elem.link
							tag.tag_x = elem.tag_x
							tag.tag_y = elem.tag_y
							tags.push(tag)	
						}
						
					})

					res.render('image', {
						title: image.title_img,
						fname: 'http://www.clothtag.99k.org/' + image.filename,
						template: 'image',
						imageId: image.filename,
						tags: tags

					})
				} else {
					res.render('error')
				}
			
			}
		})		
	})



	//TODO client must do ajax to this url and provide store = {title, link, filename}
	app.post('/images/:id/tag', function(req, res, next) {

		console.log("GET /images/:id/tag")
		
		var store = {
			filename: req.params.id,
			link: req.body.link,
			title: req.body.title,
			x: req.body.x,
			y: req.body.y
		}

		console.log(store)

		data.addTag(store, function(err) {
			if(err) {
				console.log(err)
				res.redirect('/asdfasdfs')
			} else {
				res.redirect('/images/' + store.filename)
			}
		})
	})


	app.post('/images', function(req, res, next) {

		console.log('uploading new image')

		
		
		var store = {
			path: req.files.image.path,
			title: req.body.title
		}

		console.log(store)

		data.addImage(store, function(err, newStore) {
			console.log('add image onDonbe')
			
			var splits = newStore.path.split('/');
			var fname = splits[splits.length-1]

			if(err) {
				res.redirect('/error')
			} else {
				res.redirect('/images/' + fname)
			}
		})
	
		
	})


	app.get('/contact', function(req, res) {

		console.log("GET /contact")

		res.render('contact', {
			title:'Contact us',
			template: 'contact'
		})
	})


	app.get('/register', function(req, res) {

		console.log("GET /register")

		res.render('register', {
			title: 'Hello New User',
			template: 'register'
		})
	})

	app.post('/users', function(req, res) {

		console.log("GET /users")

		console.log(req.body)
		var store = req.body
		store.isActive = false

		data.addUser(store, function(err) {
			if(err) {
				console.log(err)
				res.send('Error creating user')
			} else {

				res.send('USer successfully created')
				//code for success
				// res.render('user', {
				// 	title:'Please activate your account',
				// 	template: 'user'
				// })
			}
		})
	})

	app.get('*', function(req, res){
  		res.send(404);
	});
}


