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

    // main login page
    app.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login',
            template: 'login'
        })
    })

    app.post('/login-success', function(req, res, next) {


        console.log(req.body)
        var store = req.body

        data.validateLogin(store, function(err,match) {
            if(err != undefined || match == undefined) {
                console.log(err)
                //res.send('User not found or account is not activated')
                var err_msg = 'User not found or account is not activated'
                serveError(err_msg, req, res, next)
            } else {
                res.redirect('/');
            }
        })
    })

    app.get('/register', function(req, res) {
        res.render('register', {
            title: 'Hello New User',
            template: 'register'
        })
    })

    app.post('/users', function(req, res) {


        console.log(req.body)
        var store = req.body
        store.isActive = false
    
    if(store.user != '' || store.email != '' || store.pass != '' || store.passRepeat != ''){
        data.addUser(store, function(err) {
            
            if(err) {
                console.log(err)
                res.send('Error creating user')
            } else {
                var link = '<p><a href="http://localhost:3000/activate?email=' + store.email +'">Activate your account</a></p>'
                var recipient = store.user + ' <' + store.email + '>'
                var html = '<html><body>';
                html +='<p>Please click on the link below to activate your account</p>'
                html += link
                html +='</body></html>'

                var message = {
                    text:    "i hope this works",
                    from:    "you <myhanhphucpham@gmail.com>",
                    to:      recipient,//"tien <idonwant2missathing@yahoo.com>",
                    subject: "link activation",
                    attachment:
                    [
                    {
                        data:html,
                        alternative:true
                    },

                    ]
                };
                server.send(message, function(err, message) {
                    if(err){
                        console.log(err || message);
                        //res.send('cannot send activation link')
                        
                        var err_msg = 'cannot send activation link'
                        res.render('error',{
                            title: err_msg,
                            error_message: err_msg,
                            template: 'error'
                        })
                    }
                    else{
                        res.render('users', {
                            title:'Please activate your account',
                            template: 'user'
                        })
                    }

                });

            }
            
        })} else {
                var err_msg = 'invalid fields'
                        res.render('error',{
                            title: err_msg,
                            error_message: err_msg,
                            template: 'error'
                        })
            }
    })

    app.get('/activate', function(req, res) {

        var email = req.query['email']

        data.activateAccount(email, function(err) {
            if(err) {
                console.log(err)
                res.send('Could not update database')
            } else {

                res.redirect('/login');
            }
        })
    })


    app.get('*', function(req, res){
        
    });


    app.get('/error', function(req, res){
        var err_msg = 'null'
                        res.render('error',{
                            title: err_msg,
                            error_message: err_msg,
                            template: 'error'
                        })
    })

}


