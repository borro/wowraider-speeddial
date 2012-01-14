window.addEventListener('load', function() {
	//стандартные настройки
	var feeds = (widget.preferences.feed || 'news').split(','),
		feedIntreval = widget.preferences.interval || 3600,
		content = {},
		feeds_i = 0,
		intervalIdStorage = null,
		intervalIdRotate = null;

	function changeContent() {
		if (feeds_i >= feeds.length) feeds_i = 0;
		var i = feeds_i++;
		if (feeds[i] == 'member') changeContent();
		if (content[feeds[i]] !== undefined) {
			$('output').html(content[feeds[i]].data);
			setSpeedDial(content[feeds[i]].title, content[feeds[i]].url);
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
				} else if (name == 'member'){
					$('.member').show();
					$('#newmessages').text(data[name].data[0].newmessages);
					$('#online_status span').hide();
					$('#online_status '+(data[name].data[0].online ? '.online' : '.offline')).show();
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