var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
	switch(req.method) {
		// CRUD - Create
		case 'POST':
			var item = '';
			req.setEncoding('utf8');
			req.on('data', function(chunk) {
				item += chunk;
			});
			req.on('end', function() {
				items.push(item);
				res.end('OK\n');
			});
			break;
		// CRUD - Read
		case 'GET':
			// items.forEach(function(item, i) {
			// 	res.write(i + ') ' + item + '\n');
			// });
			// res.end();
			var body = items.map(function(item, i) {
				return i + ') ' + item;				
			}).join('\n');
			res.setHeader('Content-Length', Buffer.byteLength(body));
			res.setHeader('Content-Type', 'text/plain; charset="utf-8');
			res.end(body);
			break;
		// CRUD - Delete
		case 'DELETE':
			var path = url.parse(req.url).pathname;
			var i = parseInt(path.slice(1), 10);

			if (isNaN(i)) {
				res.statusCode = 400;
				res.end('Invalid item id');				
			} else if (!items[i]){
				res.statusCode = 404;
				res.end('Item not found');
			} else {
				items.splice(i, 1);
				res.end('OK\n');
			}
			break;
		// CRUD - Update
		case 'PUT':
			var path = url.parse(req.url).pathname;
			var i = parseInt(path.slice(1), 10);

			if (isNaN(i)) {
				res.statusCode = 400;
				res.end('Invalid item id');				
			} else if (!items[i]){
				res.statusCode = 404;
				res.end('Item not found');
			} else {
				// items.splice(i, 1);
				// console.log(url.parse(req.url).query);
				var input = getParameterByName('input', url.parse(req.url).search);
				console.log(input);
				if (input) {
					items[i] = input;
					res.end('OK\n');
				} else {
					res.end('There is no input in query');
				}
			}
			break;			
	}
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

server.listen(3000);