var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
	console.log(req.url);

	if (req.url == '/favicon.ico')
	{
		var index = fs.readFileSync('favicon.ico');

		res.writeHead(200, {'Content-Type': 'image/x-icon'});
		res.end(index);

		return;
	}


	if (req.url == '/index.html')
	{
		var index = fs.readFileSync('index.html');

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(index);

		return;
	}


	var index = fs.readFileSync('404.html');

	res.writeHead(404, {'Content-Type': 'text/html'});
	res.end(index);

}).listen(80);
