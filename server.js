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
    
    console.log("http express server (test_app) listening om http://%s:%s", host, port);
 });

// test_app static files (cache) - for testing
test_app.use('/cache', express.static(__dirname + '/cache'));

// -------------------------
// app
// -------------------------

// app test '/' API end point
app.get('/', function (req, res) {
    res.send('Cache Test is up and running :) (app)');
});

test_app.get('/api/test', function (req, res) {
    res.send('Cache Test is up and running :) (app_test)');
});

app.get('/createPdf', function (req, res) {
    //res.send('Cache Test is up and running :)');

    //var content;
    var content = "<div>From localhost:3004 (cache) - should fail</div>";
    content += "<img style='width: 200px;' src='http://localhost:3004/cache/testImage.jpg' /><br /><br />"; // :3004 (no staic files)
    content += "<div>From localhost:3005 (cache)</div>";
    content += "<img style='width: 200px;' src='http://localhost:3005/cache/testImage.jpg' /><br /><br />"; // :3005 (HAS static files)
    content += "<div>From aws (test env)</div>";
    content += "<div><iframe src='http://13.236.68.68:3000/api/testdata'></iframe></div>";
    content += "<div>From app locahost:3004 </div>";
    content += "<div><iframe src='http://localhost:3004/'></iframe></div>";
    content += "<div>From app locahost:3005 </div>";
    content += "<div><iframe src='http://localhost:3005/api/test'></iframe></div>";

    var html = content;
    var finalOptions = "";

    writeToPdf(html, finalOptions, function(err, stream) {
    if (err) return res.status(500).send(err);
        stream.pipe(res);
        console.log('\x1b[32m%s\x1b[0m', 'PDF generated OK! - and returned');  
    });   
});

// write pdf
function writeToPdf(html, options, callback) {
	if (html.indexOf('<script') == 1 || html.indexOf('<SCRIPT') == 1) {
		return callback('html containing malicious script tag');
	}

    pdf.create(html, options).toStream(callback);
}


