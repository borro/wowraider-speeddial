window.addEventListener('load', function() {
	//стандартные настройки
	var feeds             = parseConfFeeds(widget.preferences.feed || 'news'),
		update_interval   = widget.preferences.update_interval || 180,
		frequency_change  = widget.preferences.frequency_change || 5,
		content           = {},
		feeds_i           = 0,
		intervalIdStorage = null,
		intervalIdUpdate  = null,
		intervalIdRotate  = null;

	//чтобы jQuery не тупила с кросс-доменными запросами
	$.ajaxSetup({crossDomain: false});

	/**
	 * Смена лент
	 */
	function changeContent() {
		if (feeds_i >= feeds.length) feeds_i = 0;
		var i = feeds_i++;
		if (feeds[i] == 'member') changeContent();
		if (content[feeds[i]] !== undefined) {
			$('div.output').animate({opacity: 0.0}, 700, function(){
				setSpeedDial(content[feeds[i]].title, content[feeds[i]].url);
				$('output', this).html(content[feeds[i]].data);
				$(this).animate({opacity: 1.0}, 700);
			});
		}
	}

	/**
	 * получение контента
	 */
	function getContent()
	{
		$.getJSON('http://wowraider.ru/api', {data: feeds.join(',')}, function (data) {
			var hideMember = true;
			content = {};
			for (var name in data) if (data.hasOwnProperty(name)) {
				if (feedsParsers[name]) {
					content[name] = {
						title: data[name].title,
						url: data[name].url,
						data: feedsParsers[name](data[name])
					};
				} else if (name == 'member'){
					hideMember = false;
					$('.member').show();
					$('#newmessages').text(data[name].data[0].newmessages);
					$('#online_status span').hide();
					$('#online_status '+(data[name].data[0].online ? '.online' : '.offline')).show();
				}
			}
			if (hideMember) $('.member').hide();
		});
	}

	//следим за изменение настроек
	addEventListener('storage', function () {
		feeds            = parseConfFeeds(widget.preferences.feed || 'news');
		update_interval  = widget.preferences.update_interval || 180;
		frequency_change = widget.preferences.frequency_change || 5;
		
		/**
		 * получаем контент с задержкой, чтобы если пользователь кликнул
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
	
	setTimeout(changeContent, 1000);
});