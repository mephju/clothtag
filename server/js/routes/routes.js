
/**
 * This module's only ppurpose is to associate routes to their controller 
 * functions. 
 */


var data = require('../model/data')
var imageRoutes = require('./images')
var user = require('../user/user')



exports.setRoutesOn = function(app) {



    app.get('/', imageRoutes.getImages)


    app.get('/images/new', imageRoutes.getNewImage)
    app.get('/images/search/:searchkey', imageRoutes.search) 
    app.get('/images/:id', imageRoutes.getImage)
    app.post('/images/:id/tag', imageRoutes.postTag)
    app.post('/images', imageRoutes.postImage)


    app.get('/register', user.register)
    app.get('/login', user.login)   
    app.post('/login-success', user.loginSuccess)
    app.get('/logout', user.logout)
    app.get('/register', user.register)
    app.post('/users', user.users)
    app.get('/activate', user.activate)
    app.get('/myimages', imageRoutes.getMyImages)
    
    app.get('/contact', imageRoutes.contact
//    function(req, res) {
//        res.render('contact', {
//            title:'Contact us',
//            username: username,
//            template: 'contact'
//        })
    //}
    )

    app.get('/error', imageRoutes.error)
//    function(req, res){
//        var err = 'There was an error'
//        res.render('error',{
//            title: err,
//            error_message: err,
//            template: 'error'
//        })
//    })

    app.get('*', function(req, res){
        res.render('error', {
            title:"404 - Not Found",
            error_message:"404 -  Not Found",
            template:'error'
        })
    });


}


