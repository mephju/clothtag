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


describe('suite: data test', function() {
	describe('addTag()', function(done) {
		it('adding tag to non existent image should not work', function(done) {
			
			var store = {
				title:'test tag title',
				link:'I go nowhere',
				filename:'this/path/does/not/exist',
				x:0,
				y:0
			}
			data.addTag(store, function(err) {
				console.log(err)
				assert.ifError(err)		
				done()
			})
		})
	})
})