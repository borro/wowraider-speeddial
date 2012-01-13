window.addEventListener('load', function() {
	//стандартные настройки
	var feeds = (widget.preferences.feed || 'news').split(','),
		feedIntreval = widget.preferences.interval || 3600,
		content = {},
		feeds_i = 0,
		intervalIdStorage = null,
		intervalIdRotate = null;

	function changeContent() {
		var i = feeds_i++;
		if (content[feeds[i]] == undefined) return;
		$('output').html(content[feeds[i]].data);
		setSpeedDial(content[feeds[i]].title, content[feeds[i]].url);
		if (feeds_i >= feeds.length) {
			feeds_i = 0;
		}
	}

	function getContent()
	{
		ajaxGet('http://wowraider.ru/common/api.cdiml?data='+feeds.join(','), function (data) {
			data = $.parseJSON(data);
			content = {};
			for (var name in data) if (data.hasOwnProperty(name)) {
				if (feedsParsers[name]) {
					content[name] = {
						title: data[name].title,
						url: data[name].url,
						data: feedsParsers[name](data[name])
					};
				}
			}
			feeds_i = 0;
			changeContent();
		});
	}

	//следим за изменение настроек
	addEventListener('storage', function () {
		feeds = (widget.preferences.feed || 'news').split(',');
		feedIntreval = widget.preferences.interval || 3600;
		if (intervalIdStorage) clearTimeout(intervalIdStorage);
		intervalIdStorage = setTimeout(function() {
			getContent();
			if (intervalIdRotate) clearInterval(intervalIdRotate);
			intervalIdRotate = setInterval(changeContent, 3000);
		}, 500);
	}, false);

	//меняем контент каждые 10 секунд
	intervalIdRotate = setInterval(changeContent, 3000);
	getContent();
});