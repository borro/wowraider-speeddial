var tests_list = {
	correctness_feeds: function() {
		var test_result = 'fail', descr = 'default';
		$.ajax({
			url: 'http://wowraider.ru/api',
			dataType: 'json',
			async: false,
			data: {data: 'news,blues:ru,blues:ru:bluestart,blues:en,blues:en:bluestart,blogs,posts,comments,streams,questions,member,plf,glf,slf'},
			success: function (data, textStatus, jqXHR) {
				var feeds_count = 0;
				for ( var i in data) ++feeds_count;
				if (feeds_count != 14) {
					test_result = 'fail';
					descr = 'В объекте всего '+feeds_count+' элементов';
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				test_result = 'fail';
				descr = 'jQuery.ajax: ' + textStatus;
			}
		});
		
		return {name: 'Корректность получения всех лент', result: test_result, description: descr};
	}
};