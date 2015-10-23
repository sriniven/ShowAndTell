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

var getTitleAndId = function(name) {
    var imageName = path.basename(name, path.extname(name));
    var splits = imageName.split('-');
    var number = parseInt(splits[0]);
    var title;
    if(isNaN(number)) {
        number = 0;
        title = name;
    } else {
        title = splits.slice(1,splits.length).join(' ');
    }
    return {id: number, title: title};
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
        var generate = function () {
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
        fs.stat(thumbPath, function (err, destStats) {
            if (err) { // If thumb does not exist, generate it
                generate();
                console.log('DOES NOT EXIST: ', image.filename);
                return;
            }
            // If it exists, compare for modified times
            console.log('EXISTS: ', image.filename);
            fs.stat(image.filename, function (err, sourceStats) {
                if (err) {//Shouldn't happen
                    callback(null, '/' + path.relative(outDir, thumbPath));
                }
                if (sourceStats.mtime > destStats.mtime) {
                    generate();
                } else {
                    callback(null, '/' + path.relative(outDir, thumbPath));
                }
            });
        });
    };

    var generateImage = function (image, callback) {
        var imagePath = path.join(imagesOutDir, image.collection, image.name);
        var generate = function () {
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
        fs.stat(imagePath, function (err, destStats) {
            if (err) { // If thumb does not exist, generate it
                generate();
                console.log('DOES NOT EXIST: ', image.filename);
                return;
            }
            // If it exists, compare for modified times
            console.log('EXIST: ', image.filename);
            fs.stat(image.filename, function (err, sourceStats) {
                if (err) {//Shouldn't happen
                    callback(null, '/' + path.relative(outDir, imagePath));
                }
                if (sourceStats.mtime > destStats.mtime) {
                    generate();
                } else {
                    callback(null, '/' + path.relative(outDir, imagePath));
                }
            });
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
                if (err) {
                    callback(err);
                }
                var titleAndId = getTitleAndId(image.name);
                results.title = titleAndId.title;
                results.id = titleAndId.id;
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
                    async.mapSeries(imagePaths, processImage, function (err, result) {
                        var pictures = result.filter(function (p) {
                            return p.title.toLowerCase().indexOf('gallery_cover') === -1;
                        }).sort(function(p1, p2) {
                            return p1.id - p2.id;
                        });
                        var collectionObject = {
                            title: capitalize(collection.name),
                            picture: path.join('/thumbs/', collection.name, 'gallery_cover.jpg'),
                            pictures: pictures
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

    fs.readdir(imagesDir, function (err, collections) {
        var collectionDirs = removeHidden(collections).map(function (c) {
            return {name: c, dir: path.join(imagesDir, c)};
        });
        async.map(collectionDirs, processCollection, function (err, data) {
            if (!err) {
                writeFile(data);
            }
            doneCallback();
        });
    });

};