var fs = require('fs'),
    gm = require('gm'),
    async = require('async'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    remove = require('remove');

function removeHidden(collections) {
    return collections.filter(function (collection) {
        return collection[0] !== '.';
    });
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1, str.length);
}

var resizeImage = function (imagePath, dimensions, outPath) {
    gm(imagePath)
        .resize(dimensions.x, dimensions.y)
        .write(outPath);
};

var generateThumbnail = function (imagePath, outPath) {
    resizeImage(imagePath, {x: 133, y: 150}, outPath);
};

var generateActualImage = function (imagePath, outPath) {
    resizeImage(imagePath, {x: 800, y: 600}, outPath);
};

module.exports = function (options, doneCallback) {
    var inDir = options.inDir,
        outDir = options.outDir,
        dataFilePath = path.join(outDir, 'data.js'),
        imagesDir = path.join(inDir, 'images'),
        thumbsDir = path.join(outDir, 'thumbs'),
        imagesOutDir = path.join(outDir, 'images');

    var generateThumb = function (image, callback) {
        var thumbPath = path.join(thumbsDir, image.collection, image.name);
        gm(image.filename)
            .resize(133, 150)
            .write(thumbPath, function (err) {
                if (err) {
                    console.error('Error', err);
                    callback(err);
                }
                callback(null, '/' + path.relative(outDir, thumbPath));
            });
    };

    var generateImage = function (image, callback) {
        var imagePath = path.join(imagesOutDir, image.collection, image.name);
        gm(image.filename)
            .resize(800, 600)
            .write(imagePath, function (err) {
                if (err) {
                    console.error('Error', err);
                    callback(err);
                }
                callback(null, '/' + path.relative(outDir, imagePath));
            });
    };

    var processImage = function (image, callback) {
        console.log('PROCESSING Image: ', image.name);
        async.parallel(
            {
                thumb: function (cb) {
                    generateThumb(image, cb);
                },
                url: function (cb) {
                    generateImage(image, cb)
                }
            }
            , function (err, results) {
                if(err) {
                    callback(err);
                }
                results.title = capitalize(path.basename(image.name, path.extname(image.name)));
                callback(null, results);
            });
    };

    var processCollection = function (collection, callback) {
        console.log('PROCESSING COLLECTION: ', collection.name);
        fs.readdir(collection.dir, function (err, images) {
            var imagePaths = removeHidden(images).map(function (image) {
                return {name: image, collection: collection.name, filename: path.join(collection.dir, image)};
            });
            async.parallel(
                [
                    function (cb) {
                        mkdirp(path.join(thumbsDir, collection.name), null, function (err) {
                            console.error(err);
                            cb();
                        });
                    },
                    function (cb) {
                        mkdirp(path.join(imagesOutDir, collection.name), null, function (err) {
                            console.error(err);
                            cb();
                        });
                    }
                ], function () {
                    async.map(imagePaths, processImage, function (err, result) {
                        var collectionObject = {
                            title: capitalize(collection.name),
                            picture: path.join('/thumbs/', collection.name, 'gallery_cover.jpg'),
                            pictures: result.filter(function(p){return p.title.toLowerCase().indexOf('gallery_cover') === -1;})
                        };
                        callback(err, collectionObject);
                    });
                }
            );
        });
    };

    var writeFile = function (data) {
        var json = JSON.stringify(data);
        var fileContents = 'window.galleries = ' + json;
        fs.writeFile(dataFilePath, fileContents);
    };

    async.parallel(
        [
            function (cb) {
                remove(thumbsDir, null, cb)
            },
            function (cb) {
                remove(imagesOutDir, null, cb)
            }
        ],
        function (err) {
            fs.readdir(imagesDir, function (err, collections) {
                var collectionDirs = removeHidden(collections).map(function (c) {
                    return {name: c, dir: path.join(imagesDir, c)};
                });
                console.log(collections);
                async.map(collectionDirs, processCollection, function (err, data) {
                    if(!err) {
                        writeFile(data);
                    }
                    doneCallback();
                });
            });
        }
    );

};