var tests_list = {
	correctness_feeds: function(callback) {
		var test_result = {name: 'Корректность получения всех лент', result:'pass', description: []};
		$.ajax({
			url: 'http://wowraider.ru/api',
			dataType: 'json',
			data: {data: 'news,blues:ru,blues:ru:bluestart,blues:en,blues:en:bluestart,blogs,posts,comments,streams,questions,member,plf,glf,slf'},
			success: function (data, textStatus, jqXHR) {
				var feeds_count = 0;
				for (var i in data) {
					if (data[i].title === undefined) {
						test_result.result = 'fail';
						test_result.description.push('Отсутствует title в ленте '+i);
					}
					if (data[i].url === undefined) {
						test_result.result = 'fail';
						test_result.description.push('Отсутствует url в ленте '+i);
					}
					if (data[i].data === undefined) {
						test_result.result = 'fail';
						test_result.description.push('Отсутствует data в ленте '+i);
					} else {
						if (!(data[i].data instanceof Array)) {
							test_result.result = 'fail';
							test_result.description.push('Data в ленте '+i+' не является массивом');
						} else if (data[i].data.length > 0) {
							switch(i) {
								case 'news':
								case 'blues:ru':
								case 'blues:ru:bluestart':
								case 'blues:en':
								case 'blues:en:bluestart':
								case 'blogs':
								case 'posts':
								case 'comments':
								case 'streams':
								case 'questions':
									if (data[i].data[0].title === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует title в data ленты '+i);
									}
									if (data[i].data[0].url === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует url в data ленты '+i);
									}

									++feeds_count;
								break;
								case 'member':
									if (data[i].data[0].online === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует online в data ленты '+i);
									}
									if (data[i].data[0].newmessages === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует newmessages в data ленты '+i);
									}
									++feeds_count;
								break;
								case 'plf':
									if (data[i].data[0].title === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует title в data ленты '+i);
									}
									if (data[i].data[0].number === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует number в data ленты '+i);
									}
									++feeds_count;
								break;
								case 'glf':
								case 'slf':
									if (data[i].data[0].title === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует title в data ленты '+i);
									}
									if (data[i].data[0].number === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует number в data ленты '+i);
									}
									if (data[i].data[0].classid === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует classid в data ленты '+i);
									}
									if (data[i].data[0].classcolor === undefined) {
										test_result.result = 'fail';
										test_result.description.push('Отсутствует classcolor в data ленты '+i);
									}
									++feeds_count;
								break;
							}
						} else {
							++feeds_count;
						}
					}

				}
				if (feeds_count != 14) {
					test_result.result = 'fail';
					test_result.description.push('В объекте всего '+feeds_count+' элементов');
				}
				callback(test_result);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				test_result = 'fail';
				test_result.description.push('jQuery.ajax: ' + textStatus);
				callback(test_result);
			}
		});
	},
	change_feeds_interval: function(callback) {
		var test_result = {name: 'Смена лент в зависимости от интервала', result: 'pass', description: []},
			intervalValueFail = 0,
			feeds_count = parseConfFeeds(widget.preferences.feed).length,
			iteration = 0,
			tmp_content = $('output').html(),
			start_time = (new Date()).getTime();

		var checkIntervalId = setInterval(function(){
			if (tmp_content != $('output').html() && tmp_content != '') {
				var time = (new Date()).getTime() - start_time;
				if (!(- 100 <= time && time <=  widget.preferences.frequency_change*1000 + 100)) {
					++intervalValueFail;
				} else {
					tmp_content = $('output').html();
					start_time = (new Date()).getTime();
					++iteration;
				}
			} else if (tmp_content == '') {
				start_time = (new Date()).getTime();
				tmp_content = $('output').html();
			} else {
				tmp_content = $('output').html();
			}

			if (intervalValueFail > 1) {
				test_result.result = 'fail';
				test_result.description.push('Превышено количество непройденных интервалов');
				clearInterval(checkIntervalId);
				callback(test_result);
			}
			
			if (iteration >= feeds_count*2) {
				clearInterval(checkIntervalId);
				callback(test_result);
			}

		}, 100);
	}
};