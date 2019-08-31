const https = require('https');	// будем пользоваться модулем HTTPS (HTTP - не подходит, т.к. у нас HTTPS)

var sum=0, avg=0, min=1e10, max=0;	// min - у нас изначально типа очень большой

// ф-ция разбора HTML-кода полученного со страницы сайта
function parse(html)
{
	var start_index = 0;	// позиция с которой будет начинаться и в последстыии продолжаться поиск
	var count = 0;

	const noResults = '<span class="button pagenum">no results</span>';

	var fin = html.indexOf(noResults);
	if (fin != -1)
		return false;

	html = html.replace(/ /g, '');	// удаляем все пробелы по регулярногму выражению (g - значит global т.е. везде)
	html = html.replace(/\n/g, '');	// и также все переводы строк
	html = html.replace(/\r/g, '');	// их два вида бывает
//	console.log(html); //	return;

	// наш искомый фрагмент текста (паттерн/pattern)
	const pattern = '<spanclass="result-meta"><spanclass="result-price">';

	// бесконечный цикл
	while (true)
	{
		var ind1 = html.indexOf(pattern, start_index);	// ищем наш искомый фрагмент начиная с позициии в текск = start_index; результат будет позиия в тексте нашего искомого фрагмента
		var ind2 = html.indexOf('</span>', ind1);		// и ищем закрывающий тег

		// заканчиваем цикл когда не сможем найти наш искомый фрагмент
		if (ind1 == -1)
			break;

		/*
			          ind1	ind2
			           ↓    ↓
			Текст: Вот Алиса пришла домой
			Ищем: Алиса
			Ищем конец слова: " "
			indexOf(текст, ищем) - вернет позицию в тексте (ind1)
			substring(ind1, ind2) - вернет слово Алиса
		*/

		ind1 += pattern.length + 1;	// избавляемся от искомого фрагмента и доллара
		var price = html.substring(ind1, ind2);	// наш ценник это текст от ind1 до ind2
		price = parseInt(price);	// помним что у нас резултат в вде строки, а рабать мы будем с числам - конвертируем строку в число (parseInt)

		console.log(++count, price);

		sum += price;

		// если цена меньше чем текущий минимум - назначаем переменной отвечающей за миниму - текущую цену
		if (price < min)
			min = price;

		if (price > max)
			max = price;

		start_index = ind2;
	}

	avg = sum / count;
	console.log(`avg = ${avg} min = ${min} max = ${max}`);	// составная строка с переменными в апострофах и в них переменные заключаются в $()
	//console.log('avg = ' + avg + ' min = ' + min + ' max = ' + max);

	return true;// возвращаем true
}


function call_site(start_index)
{
	// будем тащить данные с URL ниже
	https.get('https://miami.craigslist.org/d/realty/search/rea?s=' + start_index, (resp) =>
	{
		let data = '';	// переменная для накопления данных

		// ф-ция которая будет принимать данные (кусками)
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// ф-ция когда все данные пришли
		resp.on('end', () => {
			//console.log(data);

			// парсим наши данные (текст HTML со страницы)
			if (parse(data))
			{
				setTimeout(call_site, 1, start_index + 120);
			}
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);	// сюда попадем есмли что-то пойдет не так
	});
}


var page_start = 0;

setTimeout(call_site, 100, page_start)