var http = require('http');	
var fs = require("fs");	
var querystring = require('querystring');	

function accept(req, res)
{
	console.log(req.method, req.url);

	if (req.method == "GET")	 
	{
		if (req.url == "/")	
		{
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Cache-Control': 'no-cache'
			});	
			
			var index = fs.readFileSync("ajax.html");	
			
			res.end(index);	
			
			return; 
		}

		//Здесь мы будем возвращать содержимое файла chat.txt
		if (req.url == "/update")	
		{
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Cache-Control': 'no-cache'
			});	
			
			var index = fs.readFileSync("chat.txt");
			
			res.end(index);	
			
			return; 
		}

		if (req.url == "/script.js")	
		{
			res.writeHead(200, {
				'Content-Type': 'text/javascript',
				'Cache-Control': 'no-cache'
			});	
			
			var index = fs.readFileSync("script.js");	
			
			res.end(index);	
			
			return; 
		}

		if (req.url == "/style.css")	
		{
			res.writeHead(200, {
				'Content-Type': 'text/css',
				'Cache-Control': 'no-cache'
			});	
			
			var index = fs.readFileSync("style.css");	
			
			res.end(index);	
			
			return; 
		}

	} // if get


	if (req.method == "POST")
	if (req.url == "/chat")
	{
		console.log('POST');

		var body = '';
		var counter=0;

		req.on('data', function(data) {
			body += data;
			counter++;
		 	console.log('Part: # ' + counter + ' ' + body.length);
		});

		req.on('end', function() {
			console.log('Body: ' + body);

			//парсим body который содержит два параметра: имя пользователя и его сообщение
			// например user=Lena&text=privet
			//в переменной q будет содержаться пара ключ: значение { user: Lena, text: privet}
			var q = querystring.parse(body);

			console.log(q.user, q.text);

			//формируем строчку для сохранения файла
			// \t - табуляция, \n - перенос строки
			var save_data = q.user + ":\t" + q.text + "\n";

			fs.appendFile('chat.txt', save_data, function (err) {
				if (err) throw err;
				console.log('Updated!');
			});

			res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
		 	res.end('Saved');
		});

		return;
	}

	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Cache-Control': 'no-cache'
	});

	res.end("OK");
}

http.createServer(accept).listen(8080);