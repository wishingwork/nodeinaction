var http = require('http');
var parse = require('url').parse;
// put path directory and file name together
var join = require('path').join;
var fs = require('fs');

// Get the current file directory
var root = __dirname;
var server = http.createServer(function(req, res) {
	var url = parse(req.url);
	// Put directory and file name together
	var path = join(root, url.pathname);

	//// Read file and write out
	// var stream = fs.createReadStream(path);
	// stream.on('data', function(chunk) {
	// 	res.write(chunk);
	// });
	// stream.on('end', function() {
	// 	res.end();
	// });

	// Use stat to check if the static file exist or not
	fs.stat(path, function(err, stat) {
		if (err) {
			if ('ENOENT' == err.code) {
				res.statusCode = 404;
				res.end('Not Found');
			} else {
				res.statusCode = 500;
				res.end('Internal Server Error');
			}
		} else {
			res.setHeader('Content-Length', stat.size);
			var stream = fs.createReadStream(path);
			// pipe get source and write out 
			stream.pipe(res);
			stream.on('error', function(err) {
				res.statusCode = 500;
				res.end('Internal Server Error');
			});
		}
	});
});

server.listen(3000);
