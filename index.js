var express = require('express');
var generate = require('./generate');

var app = express();

var updateData = function (logger, cb) {
    generate({inDir: process.env.ST_IMAGES_PATH, outDir: process.env.ST_GENERATE_PATH}, logger, cb);
};

app.get('/refresh', function (req, res) {
    if (req.query.challenge) {
        res.send(req.query.challenge);
        return;
    }
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=UTF-8'
    });
    updateData(function (msg) {
            res.write(msg + '<br/>');
        },
        function () {
            res.write('DONE!')
            res.end();
        });
});

app.post('/refresh', function (req, res) {
    // We don't care about what user's data got updated. Just update /data.js
    updateData(function () {
        res.send("Refreshed!");
    });
});

app.listen(process.env.PORT || 3000);