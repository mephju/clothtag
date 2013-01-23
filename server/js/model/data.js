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
 * [addImage description]
 * @param {[type]} filename 
 * [filename of the image to be referenced in db. absolute path
 * @param {[type]} onDone   [description]
 */
exports.addImage = function(store, onDone) {

	

	var saveToDb = function(err) {

		if(err) {
			onDone('error')
		} else {
			console.log('no error uploading image...proceed with saveToDb')
			var error = false;

			var splits = store.path.split('/');
			var fname = splits[splits.length-1]

			console.log('insert: ' + store)
			var query = client.query('INSERT INTO image(filename, title) VALUES($1, $2)', [fname, store.title])	

			query.on('end', function() {
				if(error) {	onDone('error') }
				else {		onDone(null, store)	}
			})

			query.on('error', function(err) {
				error = true;
				console.log('error inserting image ' + err)
			})
		}		
	}

	imageStore.uploadImage(store, saveToDb);	
}




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


exports.addTag = function(store, onDone) {
	console.log('adding tag')
	try {
		var query = client.query('INSERT INTO tag(title, link, filename, tag_x, tag_y) VALUES($1, $2, $3, $4, $5)', 
		[store.title, store.link, store.filename, store.x, store.y])
	} catch(err) {
		console.log(err)
		onDone(err)
	}	

	query.on('end',  function() {
		onDone(null)
	})

	query.on('error', function(err) {
		onDone(err)
	})
}

var crypto = require('crypto')
var hash = function (pass, salt){
    var h = crypto.createHash('sha512')
    
    h.update(pass)
    h.update(salt)
    
    return h.digest('base64')
    
}


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

// login validation method
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
