//url: db.f4.htw-berlin.de:5432:require
//db: _s0541224__clothtagdb
//user: _s0541224__clothtagdb_generic
//pass: clothtag
//
//
var pg = require('pg')

var connectionString = 'postgres://_s0541224__clothtagdb_generic:clothtag@db.f4.htw-berlin.de:5432/_s0541224__clothtagdb'

client = new pg.Client(connectionString);
client.connect();

// query = client.query('SELECT * FROM image');
// query.on('row', function(row) { console.log(row)})
// query.on('end', function() { client.end(); })


/**
 * [addImage description]
 * @param {[type]} filename [filename of the image to be referenecs in db. 
 * this doesn't include the path, but only the file name]
 * @param {[type]} onDone   [description]
 */
exports.addImage = function(store, onDone) {

	var error = false;

	console.log('insert: ' + store)
	var query = client.query('INSERT INTO image(filename, title) VALUES($1, $2)', [store.filename, store.title])	

	query.on('end', function() {
		if(error) onDone('error')
		else {
			//query = client.query('SELECT * FROM')
			onDone(null, store)
		}
	})


	query.on('error', function(err) {
		error = true;
		console.log('error inserting image ' + err)
		
	})
}




exports.getImage = function(id, onDone) {
	var error = false;
	var match = null;

	console.log('retrieve: ' + id)
	var query = client.query('SELECT * FROM image WHERE filename=$1', [id])	

	query.on('end', function() {
		if(error) {
			onDone('error')
		} else {
			//query = client.query('SELECT * FROM')
			onDone(null, match)
		}
	})

	query.on('row', function(row) {
		match = row;
		console.log(row)
	})


	query.on('error', function(err) {
		error = true;
		console.log('error retrieving an image ' + err)
		
	})
}


