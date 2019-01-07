'use strict';

var pdf = require('html-pdf');
var express = require('express');
var app = express();
var test_app = express();

// init (app)
var server = app.listen(3004, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("\u001b[2J\u001b[0;0H");
    console.log("Cache Test listening at http://%s:%s", host, port);
 });

 // init (test_app)
 var test_server = test_app.listen(3005, function () {
    var host = test_server.address().address
    var port = test_server.address().port
    
    //console.log("\u001b[2J\u001b[0;0H");
    console.log("Cache Test listening at http://%s:%s", host, port);
 });

// -------------------------
// app
// -------------------------

// app test '/' API end point
app.get('/', function (req, res) {
    res.send('Cache Test is up and running :) (app)');
});

app.get('/createPdf', function (req, res) {
    //res.send('Cache Test is up and running :)');

    //var content;
    var content = "<img style='width: 200px;' src='http://localhost:3004/cache/testImage.jpg' /><br /><br />"; // :3004 (no staic files)
    content += "<img style='width: 200px;' src='http://localhost:3005/cache/testImage.jpg' /><br /><br />"; // :3005 (HAS static files)

    var html = content;
    var finalOptions = "";

    writeToPdf(html, finalOptions, function(err, stream) {
    if (err) return res.status(500).send(err);
        stream.pipe(res);
        console.log('\x1b[32m%s\x1b[0m', 'PDF generated OK! - and returned');  
    });   
});

// -------------------------
// test_app
// -------------------------

// test_app test '/' API end point
test_app.get('/', function (req, res) {
    res.send('Cache Test is up and running :) (test_app)');
});

// server static files (cache) - For testing
test_app.use('/cache', express.static(__dirname + '/cache'));

// write pdf
function writeToPdf(html, options, callback) {
	if (html.indexOf('<script') == 1 || html.indexOf('<SCRIPT') == 1) {
		return callback('html containing malicious script tag');
	}

    pdf.create(html, options).toStream(callback);
}


