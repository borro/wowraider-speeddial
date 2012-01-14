window.addEventListener('load', function() {
	//стандартные настройки
	var feeds = (widget.preferences.feed || 'news').split(','),
		update_interval = widget.preferences.update_interval || 180,
		frequency_change = widget.preferences.frequency_change || 5,
		content = {},
		feeds_i = 0,
		intervalIdStorage = null,
		intervalIdUpdate = null,
		intervalIdRotate = null;

	/**
	 * Смена лент
	 */
	function changeContent() {
		if (feeds_i >= feeds.length) feeds_i = 0;
		var i = feeds_i++;
		if (feeds[i] == 'member') changeContent();
		if (content[feeds[i]] !== undefined) {
			$('output').html(content[feeds[i]].data);
			setSpeedDial(content[feeds[i]].title, content[feeds[i]].url);
		}
	}

	/**
	 * получение контента
	 */
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
		});
	}

	//следим за изменение настроек
	addEventListener('storage', function () {
		feeds = (widget.preferences.feed || 'news').split(',');
		update_interval = widget.preferences.update_interval || 180;
		frequency_change = widget.preferences.frequency_change || 5;
		
		/**
		 * получаем контент с задержкой, чтобы если пользваотель кликнул
		 * несколько подряд галочек, не запустилось обновление преждевременно
		 */
		if (intervalIdStorage) clearTimeout(intervalIdStorage);
		intervalIdStorage = setTimeout(function() {
			getContent();
			feeds_i = 0;
			changeContent();
		}, 500);
		
		//меняем интервал получения данных
		if (intervalIdUpdate) clearInterval(intervalIdUpdate);
		intervalIdUpdate = setInterval(getContent, update_interval*1000);
		
		//меняем интервал смены лент
		if (intervalIdRotate) clearInterval(intervalIdRotate);
		intervalIdRotate = setInterval(changeContent, frequency_change*1000);
		
	}, false);
	
	//получаем данные каждые update_interval секунд
	intervalIdUpdate = setInterval(getContent, update_interval*1000);
	//меняем контент каждые frequency_change секунд
	intervalIdRotate = setInterval(changeContent, frequency_change*1000);
	getContent();
});