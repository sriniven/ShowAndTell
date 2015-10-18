var express = require('express');
var fs = require('fs');
var path = require('path');
var async = require('async');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var GALLERY_COVER_NAME = 'gallery_cover.jpg';
var stPath = process.env.ST_IMAGES_PATH;
var ST_URL = process.env.ST_URL;
var imagesPath = path.join(stPath, 'images');
var app = express();
function removeHidden(collections) {
    return collections.filter(function (collection) {
        return collection[0] !== '.';
    });
}

function getImageUrl(gallery, image) {
    return ST_URL + path.join('/images', gallery, image);
}

function getFullImagePath(gallery, image) {
    return cloudinary.url(getImageUrl(gallery, image), {type: 'fetch', sign_url: true});
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1, str.length);
}

function getThumbnailPath(gallery, image) {
    return cloudinary.url(getImageUrl(gallery, image), {
        type: 'fetch', sign_url: true,
        transformation: [
            {width: 133, height: 150, crop: 'thumb'}
        ]
    });
}

var updateData = function() {
    var galleries = {};

    fs.readdir(imagesPath, function (err, collections) {
        var notHidden = removeHidden(collections);

        async.map(notHidden, function (collection, callback) {
            fs.readdir(path.join(imagesPath, collection), function (err, images) {
                var pictures = removeHidden(images)
                    .filter(function (image) {
                        return image !== GALLERY_COVER_NAME;
                    })
                    .map(function (image) {
                        var title = path.basename(image, path.extname(image));
                        return {
                            title: capitalize(title),
                            url: getFullImagePath(collection, image),
                            thumb: getThumbnailPath(collection, image)
                        };
                    });
                callback(null, {
                    title: capitalize(collection),
                    picture: getThumbnailPath(collection, GALLERY_COVER_NAME),
                    pictures: pictures
                });
            });
        }, function (err, results) {
            var json = JSON.stringify(results);
            var fileContents = 'window.galleries = ' + json;
            fs.writeFile(__dirname + '/public' + '/data.js', fileContents);
        });
    })
};

app.get('/refresh', function (req, res) {
    if(req.query.challenge) {
        res.send(req.query.challenge);
        return;
    }
    updateData();
    res.send("Refreshing ... Done!");
});

app.post('/refresh', function(req, res) {
    // We don't care about what user's data got updated. Just update /data.js
    updateData();
});

app.listen(process.env.PORT || 3000);