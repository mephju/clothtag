var data = require('../model/data')

var imageRoutes = require('./images')
var email = require('../../../node_modules/emailjs/email')


var server  = email.server.connect({
    user:    "myhanhphucpham",
    password:"ithinkiloveu",
    host:    "smtp.gmail.com",
    ssl:     true
});





exports.setRoutesOn = function(app) {

    var serverError = function(msg, req, res, next) {
        res.render('error', {
            error_message: msg,
            title:msg,
            template:"error"
        })
    }

    app.get('/', imageRoutes.getImages)


    app.get('/images/new', imageRoutes.getNewImage)
    app.get('/images/search/:searchkey', imageRoutes.search) 
    app.get('/images/:id', imageRoutes.getImage)
    //TODO client must do ajax to this url and provide store = {title, link, filename}
    app.post('/images/:id/tag', imageRoutes.postTag)
    app.post('/images', imageRoutes.postImage)


    app.get('/contact', function(req, res) {
        res.render('contact', {
            title:'Contact us',
            template: 'contact'
        })
    })

    app.get('/error', function(req, res){
        var err_msg = 'null'
        res.render('error',{
            title: err_msg,
            error_message: err_msg,
            template: 'error'
        })
    })

    app.get('*', function(req, res){
        
    });
   
    // var user = require('../user.js')
    // app.get('/login', user.login)   
    // app.post('/login-success', user.loginSuccess)
    // app.get('/register', user.register)
    // app.post('/users', user.users)
    // app.get('/activate', user.activate)

}


