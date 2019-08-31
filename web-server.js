var http = require('http');
var fs = require('fs');

var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
	console.log(req.url);


	if (req.url.split('?')[0] == '/save')
	{
		var tmp = req.url.split('?')[1];
		tmp = tmp.replace(/\&/g, ',');
		tmp = tmp.replace(/\=/g, ':');

		conole.log(tmp);
		var json = JSON.parse(tmp);
		conole.log(tmp);


/*		fs.appendFile('document.txt', , function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
*/
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(json);
		return;
	}

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(index);
}).listen(80);
