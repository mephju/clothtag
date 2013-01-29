/**
 * mocha.js tests
 * Attempts to cover database related functions in the data module.
 * called by mocha.js and not by node.
 */

var assert = require('assert')
var data = require('../model/data')
var imageStore = require('../model/image-store')

// describe('model/data test suite', function() {
// 	describe('addImage()', function() {
// 		it('should run', function(done) {
			
// 			var image1 = {
//         path: 'some/path',
//         title: 'test: added by mocha'
//     	}
// 			data.addImage(image1, done)
// 		})
// 	})
// })


describe.skip('model/data test suite', function() {
	describe('uploadImage()', function() {
		it('should run', function(done) {
			this.timeout(100000)
			var image1 = {
        		path: '/home/mephju/Pictures/ani07.jpg',
        		title: 'test: added by mocha'
    		}
			imageStore.uploadImage(image1, done)
		})
	})
})


var testAddingTagToNonExistentImage = function() {
			
}
testAddingTagToNonExistentImage()

describe('Data Test:', function() {
	describe.skip('addTag()', function() {
		it('should not add a tag', function(done) {
			console.log('test adding tag')

			var store = {
				title:'test tag title',
				link:'I go nowhere',
				filename:'this/path/does/not/exist',
				x:0,
				y:0
			}
			data.addTag(store, function(err) {
				console.log(err)
				assert.notStrictEqual(
					err, 
					null, 
					'adding tag to non existent image doesnt work...good')		
			})
		})
	})

	describe('getImage()', function() {
		it('should not return an image', function(done) {
			data.getImage('*..-09//?', function(err, match) {
				
				if(typeof match == 'undefined' || match.length > 0) {
					console.log('did work...error!')
					done('error: trying to get non existent image worked...weird')					
				} else if(match.length == 0) {
					console.log('length 0....ok')
					done(null)
				}

			})
		})
	})


	describe('getImages()', function() {
		it('should return lots of images', function(done) {
			data.getImages(function(err, matches) {
				
				if(err !== null && matches.length > 0)  {
					done()
				} else {
					done(err)
				}

			})
		})
	})
})