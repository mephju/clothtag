/**
 * This module is the image controller of our application.
 * All views interested in image manipulation must call functions of this module.
 */

var data = require('../model/data')
var imageStore = require('../model/image-store')


/**
 * Renders view images/new
 */
exports.getNewImage = function(req, res, next) {
    res.render('images/new', {
        title:"Upload New Image",
        template:'images/new'
    })
}


/**
 * [getImages description]
 * Renders our index page
 */
exports.getImages = function(req, res, next) {
    data.getImages(function(err, images) {
        if(err) {
            console.log(err)
            serveError("Could not fetch images", req, res, next)
        } else {
            console.log(images)
            res.render('index', {
                title: "Recent Images",
                images: images,
                template: 'index'
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
                     tags: tags
                 })
             } else {
                 res.render('error')
             }           
         }
     })      
 }


/**
 * Adds a tag to an existing imags. 
 * Redirects to the image page this request is coming from.
 */
exports.postTag = function(req, res, next) {

    var store = {
        filename: req.params.id,
        link: req.body.link,
        title: req.body.title,
        x: req.body.x,
        y: req.body.y
    }

    //console.log(store)

    data.addTag(store, function(err) {
        if(err) {
            console.log(err)
            //res.redirect('/error')
        } else {
            res.redirect('/images/' + store.filename)
        }
    })
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

    data.addImage(store, function(err, newStore) {
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