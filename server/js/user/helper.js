
exports.getUserName = function(req, res, next){
    var username = ''
    if(req.cookies.session_id){ // if cookie still exists
            console.log(req.cookies.session_id)
            data.getUserSession(req.cookies.session_id, function ( err, match){

               if(err){
                    console.log(err)

               }
               else {
                   username = match.user
                    //return username
                    //useremail = match.email
                    //console.log( username)
               }
            })
        }else{
            username = ''
        }
        return username
}
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


