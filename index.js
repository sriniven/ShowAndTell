var express = require('express');
var generate = require('./generate');

var app = express();

var updateData = function (cb) {
    generate({inDir: process.env.ST_IMAGES_PATH, outDir: process.env.ST_GENERATE_PATH}, cb);
};

app.get('/refresh', function (req, res) {
    if (req.query.challenge) {
        res.send(req.query.challenge);
        return;
    }
    updateData(function() {
        res.send("Refreshed!");
    });
});

app.post('/refresh', function (req, res) {
    // We don't care about what user's data got updated. Just update /data.js
    updateData(function() {
        res.send("Refreshed!");
    });
});

app.listen(process.env.PORT || 3000);