// Assume we have the same connection 'conn' from before and are currently
  // authenticated ...


var fs = require('fs');
var Ftp = require('jsftp');
var im = require('imagemagick')

var isConnected = false;

var conn = null;

exports.uploadImage = function(store, onDone) {

	console.log('imageStore.uploadImage')
	console.log(store)

	conn = new Ftp({ 
		host: 'clothtag.99k.org',
		user: 'clothtag_99k',
		pass: 'htw123456htw'
	});

	fs.readFile(store.path, function (err, data) {
		if (err) {
	    	console.log('error uploading image', err)
		} else {
			var fname = getLastPathChunk(store.path)
			conn.put(fname, data, finish)		
		}
	});

	var finish = function(err) {
		if(err) console.log('error put ftp data')
		conn.raw.quit(function(err2, data) {
			var error = err || err2
    		onDone(error)
		});
	}
}

var getLastPathChunk = function(path) {
	var splits = path.split('/')
	return splits[splits.length-1]
}

	







exports.resize = function(path, onDone) {
	console.log('imageStore.resize')
	im.resize({
  		srcPath: path,
  		dstPath: path,
  		width:   320
	}, function(err, stdout, stderr){
		console.log('resizing successful? ' + err)
  		onDone(err) 
	});
}

	
	