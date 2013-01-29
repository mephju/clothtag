/**
 * This module is responsible for uploading images via ftp to our
 * ftp-accessible web space.
 */

var fs = require('fs');
var Ftp = require('jsftp');
var im = require('imagemagick')

var isConnected = false;

var conn = null;


/**
 * Upload an image to the web.
 * 
 * @param  {[type]} store  Contains the absolute path to an uploaded 
 *                         file in the /tmp directory.     
 *                         store = { path: req.files.image.path, title: req.body.title }
 * @param  {[type]} onDone the callback to be invoked upon once the operation is finished.
 *                         accepts an error object as first parameter. onDone('there was an error')
 */
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

/**
 * Returns the file name of path
 */
var getLastPathChunk = function(path) {
	var splits = path.split('/')
	return splits[splits.length-1]
}

	






/**
 * Resized an image to a fixed width and retain proper aspect ratio.
 * @param  {[type]} path   Path to the image file to be resized. 
 * @param  {[type]} onDone finish callback which accept an error object as its 
 *                         first parameter.
 */
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

	
	