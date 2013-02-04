var email = require('emailjs')
var server  = email.server.connect({
    user:    "clothtag",
    password:"clothtag-htw",
    host:    "smtp.gmail.com",
    ssl:     true
});
var data = require('../model/data')
var username = ''

exports.login = function(req, res, next){
// main login page
    //app.get('/login', function(req, res) {
        res.render('login', {
            title: 'Login',
            username: username,
            template: 'login'
        })
    //})
}

exports.logout = function(req, res, next){
// main login page
    //app.get('/login', function(req, res) {
    // clear cookie and session
        res.clearCookie('session_id')
        req.session.destroy(function(){})
        res.redirect('/login')
}

     
    
    exports.loginSuccess = function(req, res, next) {

        console.log(req.body)
        var store = req.body

        data.validateLogin(store, function(err,match) {
            if(err != undefined || match == undefined) {
                console.log(err)
                //res.send('User not found or account is not activated')
                var err_msg = 'User not found or account is not activated'
                res.render('error',{
                    title: err_msg,
                    error_message: err_msg,
                    username: username,
                    template: 'error'
                })
            } else {
                res.cookie('session_id',req.session.id)
                data.saveUserSession(req.session.id, store.email, function(err){
                    if(err) {
                        console.log(err)
                        res.send('Could not update database')
                    } else {

                        res.redirect('/');
                    }
                })

                //res.redirect('/');
            }
        })
    }

    
    
    exports.register = function(req, res) {
        console.log(req.session.id)
        //req.send({'r':req.session.test})
        console.log('register')
        res.render('register', {
            title: 'Hello New User',
            username: username,
            template: 'register'
        })
    }

    
    
    exports.users = function(req, res) {


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
    }

    
    
    exports.activate = function(req, res) {

        var email = req.query['email']

        data.activateAccount(email, function(err) {
            if(err) {
                console.log(err)
                res.send('Could not update database')
            } else {

                res.redirect('/login');
            }
        })
    }
