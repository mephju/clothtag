/**
 * This module is the image controller of our application.
 * All views interested in image manipulation must call functions of this module.
 */

var data = require('../model/data')
var imageStore = require('../model/image-store')
var check = require('validator').check
var sanit = require('validator').sanitize
var url = require('url')
var helper = require('../user/helper')

/**
 * Renders view images/new
 */
exports.getNewImage = function(req, res, next) {
    // jetzt passiert asynchronous callback
//    var username = '' //console.log("hallo " + username)
//    if(req.cookies.session_id){ // if cookie still exists
//        //username = ''
//        console.log(req.cookies.session_id)
//        data.getUserSession(req.cookies.session_id, function ( err, match){
//           
//           if(err){
//                console.log(err)
//
//           }
//           else {
//                username = match.user
//                //useremail = match.email
//                console.log( username)
//                res.render('images/new', {
//                    title:"Upload New Image",
//                    username: username,
//                    template:'images/new'
//                })
//           }
//        })
//        
//        
//    }else{
//    
//        res.render('images/new', {
//            title:"Upload New Image",
//            username: username,
//            template:'images/new'
//        })
//    }
    helper.getSessionData('images/new', req, res, next)
}


/**
 * [getImages description]
 * Renders our index page
 */
exports.getImages = function(req, res, next) {
    
    var username = ''//getUserName(req)
    //var useremail = ''//console.log("hallo " + username)
    if(req.cookies.session_id){ // if cookie still exists
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                //useremail = match.email
                //console.log( username)
           }
        })
    }
     
    
    data.getImages(function(err, images) {
        if(err) {
            console.log(err)
            serveError("Could not fetch images", req, res, next)
        } else {
            
                //console.log(images)
                //console.log( username)
                //console.log( useremail)
                res.render('index', {
                       title: "Recent Images",
                       images: images,
                       username: username,
                       template: 'index',
                       currentURL: ''
                })
            
        }
    })
}

/**
 * Renders the image page for a particular image.
 */
 exports.getImage = function(req, res, next) {
     var username = ''//getUserName(req)
     //var useremail = ''//console.log("hallo " + username)
    if(req.cookies.session_id){ // if cookie still exists
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                useremail = match.email
                console.log( username)
           }
        })
    }else{
        username=''
    }
    
     console.log("GET /images/:id")
     data.getImage(req.params.id, function(err, imageRec) {
         if(err) {
             res.render('error')
         } else {            
             if(imageRec.length) {
                 var image = imageRec[0]
                 var tags = new Array()
                 imageRec.forEach(function(elem) {
                     if(elem.title_tag && elem.link && elem.tag_x && elem.tag_y) {
                         var tag = {}
                         tag.title_tag = elem.title_tag
                         tag.link = elem.link
                         tag.tag_x = elem.tag_x
                         tag.tag_y = elem.tag_y
                         tags.push(tag)  
                     }                      
                 })
                 res.render('image', {
                     title: image.title_img,
                     fname: 'http://www.clothtag.99k.org/' + image.filename,
                     template: 'image',
                     imageId: image.filename,
                     tags: tags,
                     username: username
                 })
             } else {
                 res.redirect('/error')
             }           
         }
     })      
 }


/**
 * Adds a tag to an existing imags. 
 * Redirects to the image page this request is coming from.
 */
exports.postTag = function(req, res, next) {
    console.log(req.route.path)


    var store = {
        filename: req.params.id,
        link: req.body.link,
        title: req.body.title,
        x: req.body.x,
        y: req.body.y
    }

    console.log(store)
   
    if(isFilled(store) && check(store.link).isUrl()) {

        var m = url.parse(store.link, false, true)
        m.protocol = "http"

        console.log(m)

        // if(m.path && !m.host) {
        //     m.host = m.path
        //     m.path = null;
        // }
        
        console.log(m)
        store.link = url.format(m)


        console.log('link is valid', store.link)
        data.addTag(store, function(err) {
            if(err) {
                res.send('no url')
            } else {
                res.send(201, store)
                //res.redirect('/images/' + store.filename)
            }
        })
    } else {
        console.log('data is not valid')
        res.send(400, 'Check your link again, please. Seems like it is not valid:(')
    }



    
}


/**
 * Views call this function to upload new images. It renders the image page
 * of the uploaded image in case of success.
 */
exports.postImage = function(req, res, next) {
    
    var username = ''//getUserName(req)
    var useremail =  ''//console.log("hallo " + username)
    if(req.cookies.session_id){ // if cookie still exists
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                useremail = match.email
                console.log( username)
           }
        })
    }else{
        username=''
    }
    
    console.log('images.postImage')

    console.log(req.files)

    var store = {
        path: req.files.image.path,
        title: req.body.title
    }

    data.addImage(store, useremail, function(err, newStore) {
        console.log('add image onDonbe')

        if(err) {
            res.redirect('/error')
        } else {
            var splits = newStore.path.split('/');
            var fname = splits[splits.length-1]
            res.redirect('/images/' + fname)
        }
    })
}



var isFilled = function(obj) {
    for(var name in obj) {

        var property = obj[name]
        console.log(property)
        if(typeof property == 'undefined' || property == '') return false
    }
    return true
}

    
        


exports.getMyImages = function(req,res,next){
    
    var username = ''//getUserName(req)
    var useremail =  ''//console.log("hallo " + username)
    if(req.cookies.session_id){ // if cookie still exists
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                useremail = match.email
                
           
        
            data.getMyImages(useremail, function(err, images) {
            if(err) {
                console.log(err)
                serveError("Could not fetch images", req, res, next)
            } else {

                    console.log(images)
                    console.log(username)
                    console.log(useremail)
                    res.render('index', {
                           title: "Recent Images",
                           images: images,
                           username: username,
                           template: 'index',
                           currentURL: '/myimages'
                    })

                }
            })
        }
        })
    }else{
        res.redirect('/')
    }
    
    
}

exports.contact = function(req,res, next){
   helper.getSessionData('contact', req, res, next)
   
    
    
}

exports.error = function(req, res, next){
    //helper.getSessionData('error', req, res, next)
    var err = 'There was an error'
    var username = '' //console.log("hallo " + username)
    if(req.cookies.session_id){ // if cookie still exists
        //username = ''
        console.log(req.cookies.session_id)
        data.getUserSession(req.cookies.session_id, function ( err, match){
           
           if(err){
                console.log(err)

           }
           else {
                username = match.user
                //useremail = match.email
                console.log( username)
                res.render('error',{
                    title: err,
                    error_message: err,
                    template: 'error',
                    username: username
                })
           }
        })
        
        
    }else{
        res.render('error',{
            title: err,
            error_message: err,
            template: 'error',
            username: username
        })
    }
    
        
        
    }

