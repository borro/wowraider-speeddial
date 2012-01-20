window.debug_extention = function() {
	//рабочий див
	var tests_div = $('<div></div>').css({
			position: 'absolute',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			zIndex: '2'
		}).appendTo('body').append('<h1 style="color: #f00;">Режим тестирования</h1>'),
		tests_ol = $('<ol></ol>').appendTo(tests_div);
	
	//затемнение
	$('<div></div>').css({
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		background: '#000',
		opacity: '0.8',
		zIndex: '1'
	}).appendTo('body');
	
	//набор тестов
	$('head').append('<script src="/tests/tests.js"></script>');
	
	//прогон тестов
	console.log('Старт тестов:');
	for (var test in tests_list) {
		tests_list[test](function(result) {
			var text = result.name + ': ' + result.result + (result.result != 'pass' ? ' ('+result.description.join("\n")+')' : '');
			tests_ol.append('<li>'+text+'</li>');
			if (result.result == 'pass') console.log(text);
			else console.error(text);
		});
	}
};
