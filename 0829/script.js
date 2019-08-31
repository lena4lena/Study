
window.onload = init;	// Устанавливаем ф-цию обработчик после загрузки страницы ф-ция: init

setInterval(update, 1000); // запускаем интервал в 1 сек на ф-цию update

function init()
{
	// назначаем кнопке (тегу button) событие onclick только програмно
    document.getElementsByTagName('button')[0].onclick = function() {
		//alert('YES!');
		console.log('Click!!!');

		//var myinput = document.querySelectorAll('input[type=text]')[0];
		var myinput = document.getElementById("message");
		var text = myinput.value;
		
		var myinput2 = document.getElementById("username");
		var username = myinput2.value;

		send_data(username, text);
	};
}

// ф-ция которая будет у нас отправлять в фоне данные на сервер
function send_data(user, data)
{
	var xhttp = new XMLHttpRequest();

	console.log(data);

	// ф-ция которая будет принимать сообщения (ответы) c cервера
	xhttp.onreadystatechange = function()
	{
		// readyState - 4 = когда страница полностью загрузиласть
		// status - 200 = код возврата от сервера = все ок
	 	 if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
	  	}
  	};

	// формируем POST запрос к серверу на URL = /chat
	xhttp.open("POST", "chat", true);
	// говорим серверу, что данные приходять в формате html-формы
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// отсылаем дынные в формате URL кодидированной формы (ключ1=значение1&ключ2=значение2...)
	xhttp.send('user=' + user + '&text=' + data);
}

// ф-ция которая у нас вызывается каждую 1 сек по таймеру
// для одновления поля лога чата
function update() {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200)
		{
			// responseText - ответ от сервера
			document.getElementById("chatlog").value = this.responseText;
	  	}
  	};

	xhttp.open("GET", "update", true);
	xhttp.send();
}
