var http = require('http');
var fs = require('fs');

// Client browser reading
var server = http.createServer(function (req, res) {
	getTitles(res);
}).listen(8000, "127.0.0.1");

// Find data from JSON
function getTitles(res) {
	fs.readFile('./titles.json', function (err, data) {
		if (err) {
			hadError(err, res);
		} else {
			getTemplate(JSON.parse(data.toString()), res);
		}
	})
}

// Find template and put data into it
function getTemplate(titles, res) {
	fs.readFile('./template.html', function (err, data) {
		if (err) {
			hadError(err, res);
		} else {
			formatHtml(titles, data.toString(), res);
		}
	})
}

// Put the JSON data into template
function formatHtml(titles, tmpl, res) {
	var html = tmpl.replace('%', titles.join('</li><li>'));
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(html);
}

function hadError(err, res) {
	console.log(err);
	res.end('Server Error');
}
