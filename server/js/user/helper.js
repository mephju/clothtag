
data = require('../model/data')
exports.getSessionData = function(template, req, res, next){
    
    var username = '' //console.log("hallo " + username)
    var title = ''
    //var error_message = ''
    if(req.cookies.session_id){ // if cookie still exists
        //username = ''
        
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                
                switch(template)
                {
                    case 'contact':
                        title = 'contact us'
                        break
                    case 'images/new':
                        title = 'Upload new image'
                        break
                    case 'error':
                        title = 'Error'
                        //error_message = 'something is going wrong'
                        
                }
                //useremail = match.email
                console.log( username)
                res.render(template, {
                    title:title,
                    username: username, //=match.user
                    //error_message: error_message,
                    template: template
                })
           }
        })
        
        
    }else{
        res.render(template, {
            title:template,
            username: username, //=''
            //error_message: error_message,
            template: template
        })
    }
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


