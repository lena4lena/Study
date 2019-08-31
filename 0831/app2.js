const https = require('https');

var sum=0, avg=0, min=1e10, max=0;

function parse_html(html)
{
	var start_index = 0;	// позиция с которой будет начинаться и в последстыии продолжаться поиск
	var count = 0;
/*
	const noResults = '<span class="button pagenum">no results</span>';

	var fin = html.indexOf(noResults);
	if (fin != -1)
		return false;
*/
	//html = html.replace(/ /g, '');	// удаляем все пробелы по регулярногму выражению (g - значит global т.е. везде)
	html = html.replace(/\n/g, '');	// и также все переводы строк
	html = html.replace(/\r/g, '');	// их два вида бывает
	/*console.log(html);
	return; */

	// наш искомый фрагмент текста (паттерн/pattern)
	const pattern = '<div class="vacancy-serp-item__compensation" data-qa="vacancy-serp__vacancy-compensation">';

	// бесконечный цикл
	while (true)
	{
		var ind1 = html.indexOf(pattern, start_index);	// ищем наш искомый фрагмент начиная с позициии в текск = start_index; результат будет позиия в тексте нашего искомого фрагмента
		var ind2 = html.indexOf('</div>', ind1);		// и ищем закрывающий тег

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

		ind1 += pattern.length;	// избавляемся от искомого фрагмента и доллара
		var price = html.substring(ind1, ind2);	// наш ценник это текст от ind1 до ind2
		price = price.replace('от', "");
		price = price.replace('до', "");
		price = price.replace('руб.', "");
		price = price.replace(/ /g, "");
		price = price.replace(/\u00A0/g, "");
		// 100000-200000
		price = price.split('-');

		console.log(price/*, price.charCodeAt(3)*/);
		var price_from = parseInt(price[0]);	// помним что у нас резултат в вде строки, а рабать мы будем с числам - конвертируем строку в число (parseInt)
		var price_to = parseInt(price[1]);	// помним что у нас резултат в вде строки, а рабать мы будем с числам - конвертируем строку в число (parseInt)
		if (price.length == 1)
		{
			price_to = price_from;
		}

		console.log(++count, price_from, price_to);

		sum += (price_from + price_to)/2;

		// если цена меньше чем текущий минимум - назначаем переменной отвечающей за миниму - текущую цену
		if (price_from < min)
			min = price_from;

		if (price_to > max)
			max = price_to;

		start_index = ind2;
	}

	avg = sum / count;
	console.log(`avg = ${avg} min = ${min} max = ${max}`);	// составная строка с переменными в апострофах и в них переменные заключаются в $()
	//console.log('avg = ' + avg + ' min = ' + min + ' max = ' + max);

	return true;// возвращаем true
}

function call_site(page)
{
	// будем тащить данные с URL ниже
	https.get("https://spb.hh.ru/search/vacancy?L_is_autosearch=false&area=2&clusters=true&enable_snippets=true&text=Python&page=" + page, (resp) =>
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
			if (parse_html(data))
			{
				setTimeout(call_site, 1, page + 1);
			}
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);	// сюда попадем есмли что-то пойдет не так
	});
}

call_site(0);