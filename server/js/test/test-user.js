/**
 * mocha.js tests.
 * Attempts to cover user module code.
 */

var assert 		= require('assert')
var userMan 	= require('../user/user')
var data		= require('../model/data')


describe('Test User:', function() {
	
		

		
		// describe('active users: ', function() {
		// 	it('login with wrong passwd should not work', function(done) {
		// 		var user = {}
		// 		user.email = 'mephju@gmail.com'
		// 		user.pass = "lll"

				
		// 		var addUserIfNotExists = function() {
		// 			data.addUser(user, function(err) {
		// 				var anotherPass = "lajfdoaidsuf"
		// 				user.pass = anotherPass
		// 				validate()
		// 			})	
		// 		}

				
		// 		var validate = function() {
		// 			data.validateLogin(user, function(err, match) {
		// 				if(err)  {
		// 					done()
		// 				} else {
		// 					done("user match with wrong password...not ok.")
		// 				}
		// 			})
		// 		}

		// 		addUserIfNotExists()
		// 	})
		// })



		describe('inactive users:', function() {
			var user = {};
			before(function() {
				console.log('before()')
				user = {
					email:new Date().getTime() + '@gmail.com',
					pass:'1234987349873497kjhalfhdslkhfh'			
				}
			})
			it('inactive user should not be able to login', function(done) {
				data.addUser(user, function(err) {
					if(err) {
						done(err)
					} else {
						data.validateLogin(user, function(err) {
							if(err) {
								done()
							} else {
								done('validating should not work but it worked...wrong')
							}
						})
					}
				})
			})

			after(function(done) {
				console.log('after()')
				data.removeUser(user, done)
			})	
		})

		
})