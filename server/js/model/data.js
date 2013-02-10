/**
 * This module is responsible for saving data into our postgres database.
 */

//url: db.f4.htw-berlin.de:5432:require
//db: _s0541224__clothtagdb
//user: _s0541224__clothtagdb_generic
//pass: clothtag
//
//
var pg = require('pg')

var imageStore = require('./image-store')

var connectionString = 'postgres://_s0541224__clothtagdb_generic:clothtag@db.f4.htw-berlin.de:5432/_s0541224__clothtagdb'

client = new pg.Client(connectionString);
client.connect();

// query = client.query('SELECT * FROM image');
// query.on('row', function(row) { console.log(row)})
// query.on('end', function() { client.end(); })



/**
 * Saves metadata of an image into the image table.
 * @param {[type]} store  metadata to be saved
 * @param {[type]} onDone finish callback
 */
exports.addImage = function(store, useremail, onDone) {

	

	var saveToDb = function(err) {

		if(err) {
			onDone('error')
		} else {
			console.log('no error uploading image...proceed with saveToDb')
			var error = null;

			var splits = store.path.split('/');
			var fname = splits[splits.length-1]

			console.log('insert: ' + store)
			var query = client.query('INSERT INTO image(filename, title, uploaded_by) VALUES($1, $2, $3)', [fname, store.title, useremail])	

			query.on('end', function() {
				onDone(error, store)
			})

			query.on('error', function(err) {
				error = err;
				console.log('error inserting image ' + err)
			})
		}		
	}

	imageStore.resize(store.path, function(err) {
		if(err) throw "error resizing image: " + err
		console.log('no error resizing image...proceeding to upload image')
		imageStore.uploadImage(store, saveToDb)
	})	
}




/**
 * Retrieves image metadata for image with particular id.
 * @param  {[type]} id     id of image to retrieve metadata for
 * @param  {[type]} onDone finish callback
 */
exports.getImage = function(id, onDone) {

	var match = new Array();

	console.log('retrieve: ' + id)

	var sql = 'SELECT image.filename, image.title as title_img, image.updated_at, tag.tag_x, tag.tag_y, tag.link, tag.title as title_tag FROM image LEFT OUTER JOIN tag ON (image.filename=tag.filename) WHERE image.filename=$1'

	var query = client.query(sql, [id])	

	console.log('before querying: ')

	query.on('end', function() {
		console.log('done with querying')
		console.log(match)
		onDone(null, match)
	})

	query.on('row', function(row) {
		match.push(row)
	})


	query.on('error', function(err) {
		onDone(err)
	})
}



/**
 * Retrieves meta data of up to 12 of the latest images.
 * @param  {[type]} onDone finish callback
 */
exports.getImages = function(onDone) {
	var query = client.query('SELECT * FROM image ORDER BY updated_at DESC LIMIT 12')

	var rows = new Array();

	query.on('end', function() {
		onDone(null, rows)
	})
	query.on('row', function(row) {
		rows.push(row)
	})
	query.on('error', function(err) {
		onDone(err)
	})
}

exports.getMyImages = function(useremail, onDone) {
    console.log(useremail)
    var query = client.query('SELECT * FROM image WHERE uploaded_by=$1',[useremail])

	var rows = new Array();

	//var rows = new Array();

	query.on('end', function() {
		onDone(null, rows)
	})
	query.on('row', function(row) {
		rows.push(row)
	})
	query.on('error', function(err) {
		onDone(err)
	})
}
/**
 * Inserts a tag into the tag table.
 * Beware that the tag references an image from the image table so that
 * record must exist before you can insert tags.
 * @param {[type]} store  Contains tag information:
 *                        store = { filename: req.params.id,
        							link: req.body.link,
        							title: req.body.title,
        							x: req.body.x,
        							y: req.body.y
    						}
 * @param {[type]} onDone 	finish callback
 */
exports.addTag = function(store, onDone) {

	var err = null
	console.log('data.addTag: adding tag', store)
	try {
		var query = client.query('INSERT INTO tag(title, link, filename, tag_x, tag_y) VALUES($1, $2, $3, $4, $5)', 
		[store.title, store.link, store.filename, store.x, store.y])
	} catch(err) {
		console.log(err)
		onDone(err)
	}	

	query.on('end',  function() {
		console.log('on end exectured')
		onDone(err)
	})

	query.on('error', function(e) {
		err = e
		console.log('on error executed')
	})
}

var crypto = require('crypto')
var hash = function (pass, salt){
    var h = crypto.createHash('sha512')
    
    h.update(pass)
    h.update(salt)
    
    return h.digest('base64')
    
}

/**
 * Adds user into the user table
 * @param {[type]} store  Contains user data and should look somewhat like this:
 *                        var store = {user: 'username', passwd:'userpass', email:user@'email.com' }
 * @param {[type]} onDone finish callback
 */
exports.addUser = function(store, onDone) {
    var hashed_pass = hash(store.pass, store.email)
	var query = client.query('INSERT INTO "user"("user", email, pass, is_active) VALUES($1, $2, $3, $4)', 
		[store.user, store.email, hashed_pass, store.isActive])

	query.on('end',  function() {
		onDone(null)
	})

	query.on('error', function(err) {
		onDone(err)
	})
}



/**
 * Removes a user from the user table
 * @param  {[type]} user   Contains user data of the user to be removed
 *                         var user = { email: "em@il.com"}
 * @param  {[type]} onDone finish callback
 */
exports.removeUser = function(user, onDone) {
	console.log('removing user ' + user.email)
	var query = client.query('DELETE FROM "user" WHERE email=$1', [user.email])

	query.on('end', function() {
		console.log('removing user worked' + user.email)
		onDone(null)
	})

	query.on('error', function(err) {
		console.log('removing did NOT work', err)
		onDone(err)
	})
}

/**
 * Use this method to check the user credentials provided by a user upon login.
 * @param  {[type]} store  Contains login data
 * @param  {[type]} onDone finish callback
 */
exports.validateLogin = function(store, onDone){
    var match = new Array();
    var hashed_pass = hash(store.pass, store.email)
    
    var query = client.query('SELECT * FROM "user" WHERE pass = $1 AND email = $2 AND is_active=TRUE', [hashed_pass, store.email])

	query.on('end', function() {
		console.log('done with querying')
		console.log(match)
		if(match.length > 0) {
			onDone(null, match[0])	
		} else {
			onDone('no match for user ' + store.email)
		}
		
	})

	query.on('row', function(row) {
		match.push(row)
	})
} 


/**
 * Activates a user. Use this method to ensure a user's provided email is correct.
 * @param  {[type]} email  User's email to identify user
 * @param  {[type]} onDone finish callback
 */
exports.activateAccount = function(email, onDone){
    var query = client.query('UPDATE "user" SET is_active=$1 WHERE email=$2', 
		['true',email])

	query.on('end',  function() {
		onDone(null)
	})

	query.on('error', function(err) {
		onDone(err)
	})
}
exports.saveUserSession = function(session_id, email, onDone){
    var query = client.query('UPDATE "user" SET session_id=$1 WHERE email=$2',
                [session_id,email])
    query.on('end',  function() {
		onDone(null)
	})

	query.on('error', function(err) {
		onDone(err)
	})
}

exports.getUserSession = function(session_id, onDone){
    var match = new Array();
    //var hashed_pass = hash(store.pass, store.email)
    
    var query = client.query('SELECT * FROM "user" WHERE session_id = $1', [session_id])

	query.on('end', function() {
		console.log('done with querying')
		console.log(match)
		if(match.length > 0) {
			onDone(null, match[0])	
		} else {
			onDone('no match for user ' + session_id)
		}
		
	})

	query.on('row', function(row) {
		match.push(row)
	})
        
} 