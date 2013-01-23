// Assume we have the same connection 'conn' from before and are currently
  // authenticated ...


var fs = require('fs');
var Ftp = require('jsftp');

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
	    	console.log('error ' + err)
		} else {
			var splits = store.path.split('/');
			var fname = splits[splits.length-1]
			conn.put(fname, data, function(err) {
				conn.close()
				onDone(err)
			})		
		}
		
	});
}


	
	