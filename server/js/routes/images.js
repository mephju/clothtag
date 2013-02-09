/**
 * This module is the image controller of our application.
 * All views interested in image manipulation must call functions of this module.
 */

var data = require('../model/data')
var imageStore = require('../model/image-store')
var check = require('validator').check
var sanit = require('validator').sanitize
var url = require('url')
var username = ''
var useremail = ''


/**
 * Renders view images/new
 */
exports.getNewImage = function(req, res, next) {
    res.render('images/new', {
        title:"Upload New Image",
        username: username,
        template:'images/new'
    })
}


/**
 * [getImages description]
 * Renders our index page
 */
exports.getImages = function(req, res, next) {
    
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
         

    //if page param is not set or set with invalid values, we must set it ourselves so we can use the same code for
    //requests that set that param and those that don't
    if(typeof req.query.page == 'undefined' 
        || req.query.page < 1 
        || isNaN(req.query.page) 
        || req.query.page > Math.ceil(data.statsOnTableImage.rows/12)) {

        req.query.page = 1
    }

    


    data.getImages(req.query, function(err, images) {
        if(err) {
            console.log(err)
            serveError("Could not fetch images", req, res, next)
        } else {          
            console.log(images)
            res.render('index', {
                   title: "Recent Images",
                   images: images,
                   username: username,
                   template: 'index',
                   page: req.query.page,                    //the page that user has requested...we will use this for pagination in the view
                   numRows: data.statsOnTableImage.rows     //number of approximate rows in the db...we will use this for pagination in the view
            })
            
        }
    })
}

/**
 * Renders the image page for a particular image.
 */
 exports.getImage = function(req, res, next) {
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
   
    if(isFilled(store) && isValidUrl(store.link)) {
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
 * Checks if a given string is a
 * @param  {[type]}  string [description]
 * @return {Boolean}        [description]
 */
var isValidUrl = function(string) {
    try{
        if(check(string).isUrl() && /^http/g.test(string)) {
            var m = url.parse(string, false, true)
            console.log('link is valid')
            return true
        }
    } catch(err) {
        console.log(err)
    }
    return false
} 


/**
 * Views call this function to upload new images. It renders the image page
 * of the uploaded image in case of success.
 */
exports.postImage = function(req, res, next) {
 
    console.log('images.postImage')

    console.log(req.files)

    var store = {
        path: req.files.image.path,
        title: req.body.title
    }
    if(isFilled(store)) {
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
    } else {
        exports.getNewImage(req,res,next);
    }

        
}


/**
 * Checks for defined properties in an object.
 * If undefined or empty properties are found, false is returned 
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
var isFilled = function(obj) {
    for(var name in obj) {

        var property = obj[name]
        console.log(property)
        if(typeof property == 'undefined' || property == '') return false
    }
    return true
}

    
        


exports.getMyImages = function(req,res,next){
    
    data.getMyImages(useremail, function(err, images) {
        if(err) {
            console.log(err)
            serveError("Could not fetch images", req, res, next)
        } else {
            
                //console.log(images)
                res.render('index', {
                       title: "Recent Images",
                       images: images,
                       username: username,
                       template: 'index'
                })
            
        }
    })
}

exports.contact = function(req,res, next){
    res.render('contact', {
            title:'Contact us',
            username: username,
            template: 'contact'
        })
}

exports.error = function(req, res){
        var err = 'There was an error'
        res.render('error',{
            title: err,
            error_message: err,
            template: 'error',
            username: username
        })
    }

