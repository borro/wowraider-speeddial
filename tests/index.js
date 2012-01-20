window.debug_extention = function() {
	//рабочий див
	var debug_div = $('<div></div>').css({
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		zIndex: '2'
	}).appendTo('body').append('<h1 style="color: #f00;">Режим тестирования</h1>');
	
	//затемнение
	$('<div></div>').css({
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		background: '#fff',
		opacity: '0.5',
		zIndex: '1'
	}).appendTo('body');
	
	//набор тестов
	$('head').append('<script src="/tests/tests.js"></script>');
	
	//прогон тестов
	var result = null;
	for (var test in tests_list) {
		result = tests_list[test]();
		console.log(result);
	}
};
