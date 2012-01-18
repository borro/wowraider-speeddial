/**
 * Устанавливает заголовок окошка и куда он будет вести
 * @param title
 * @param url
 */
function setSpeedDial(title, url)
{
	if (opera.contexts.speeddial) {
		opera.contexts.speeddial.title = 'WoW RaideR: ' + title;
		opera.contexts.speeddial.url = url;
	}
}

/**
 * Небольшой костыль, чтобы не было 4х синих постов
 * @param feeds
 * @return array
 */
function parseConfFeeds(feeds)
{
	if (feeds.indexOf('blues:ru:bluestart') !== -1) {
		feeds = feeds.replace(/blues:ru,/, '');
	}
	if (feeds.indexOf('blues:en:bluestart') !== -1) {
		feeds = feeds.replace(/blues:en,/, '');
	}
	return feeds.split(',');
}

/**
 * Набор парсеров каналов
 */
var feedsParsers = {
	news: function (data) {
		return parseFeeds('news', data);
	},
	blogs: function (data) {
		return parseFeeds('blogs', data);
	},
	questions: function (data) {
		return parseFeeds('questions', data);
	},
	comments: function (data) {
		return parseFeeds('streams', data);
	}, 
	streams: function (data) {
		return parseFeeds('streams', data);
	},
	posts:  function (data) {
		return parseFeeds('streams', data);
	},
	'blues:ru': function (data) {
		return parseFeeds('blues:ru', data);
	}, 
	'blues:ru:bluestart': function (data) {
		return parseFeeds('blues:ru:bluestart', data);
	}, 
	'blues:en': function (data) {
		return parseFeeds('blues:en', data);
	}, 
	'blues:en:bluestart': function (data) {
		return parseFeeds('blues:en:bluestart', data);
	},
	plf: function (data) {
		var body = initElements('plf', data), table = $('<table></table>');
		for (var i = 0, maxi = data.data.length; i < maxi; i++) {
			table.append('<tr><td>'+data.data[i].title+'</td><td>'+data.data[i].number+'</td></tr>');
		}
		return body.append(table);
	},
	glf: function (data) {
		return parseLF('glf', data);
	},
	slf: function (data) {
		return parseLF('slf', data);
	}
};

/**
 * Инициализируем контейнер
 * @param type
 * @param data
 * @return jQuery
 */
function initElements(type, data)
{
	return $('<div class="'+type.split(':').join(' ')+'"></div>')
		.append('<h1>'+data.title+'</h1>');
}

/**
 * Типовой парсер новостей
 * @param type
 * @param data
 * @return jQuery
 */
function parseFeeds(type, data) {
	var body = initElements(type, data), ul = $('<ul></ul>');
	if (data.data.length) {
		for (var i = 0, maxi = data.data.length; i < maxi; i++) {
			ul.append('<li><a href="'+data.data[i].url+'">'+data.data[i].title+'</a></li>');
		}
	} else {
		ul.append('<li>нет данных</li>');
	}
	return body.append(ul);
}

/**
 * Типовой парсер поиска гильдий
 * @param type
 * @param data
 * @return jQuery
 */
function parseLF(type, data) {
	var body = initElements(type, data), div = $('<div class="content"></div>');
	for (var i = 0, maxi = data.data.length; i < maxi; i++) {
		div.append(
			'<div><img src="/images/wowicons/class/'+data.data[i].classid+'.gif" alt="'+data.data[i].title+'"> '
			+ '<span class="title" style="color:#'+data.data[i].classcolor+';">'+data.data[i].title+'</span> '
			+ '<span style="color:#'+data.data[i].classcolor+';">'+data.data[i].number+'</span></div>'
		);
	}
	return body.append(div);
}