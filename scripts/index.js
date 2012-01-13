window.addEventListener('load', function() {
	//стандартные настройки
	var feeds = widget.preferences.feed || 'news',
		feedIntreval = widget.preferences.interval || 3600,
		raw_data = {},
		content = {},
		feeds_i = 0,
		feedsArray = feeds.split(',');

	function changeContent() {
		var i = feeds_i++;
		if (content[feedsArray[i]] == undefined) return;
		$('output').html(content[feedsArray[i]]);
		setSpeedDial(raw_data[feedsArray[i]].title, raw_data[feedsArray[i]].url);
		if (feeds_i >= feedsArray.length) {
			feeds_i = 0;
		}
	}

	function getContent()
	{
		ajaxGet('http://wowraider.ru/common/api.cdiml?data='+feeds, function (data) {
			raw_data = data = $.parseJSON(data);
			for (var name in data) if (data.hasOwnProperty(name)) {
				if (feedsParsers[name]) {
					content[name] = feedsParsers[name](data[name]);
				}
			}
			feeds_i = 0;
			changeContent();
		});
	}

	//следим за изменение настроек
	addEventListener('storage', function () {
		feeds = widget.preferences.feed || 'news';
		feedIntreval = widget.preferences.interval || 3600;
		getContent();
	}, false);

	//меняем контент каждые 10 секунд
	setInterval(changeContent, 10000);

	getContent();
});