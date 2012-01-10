window.addEventListener('load', function() {
	var currentFeed = widget.preferences['feed'] || 'news';
	var feedIntreval = widget.preferences['interval'] || 3600;
	var intervalId = null;
	var feedsOptions = {
		'news': {
			title: 'Новости',
			url: 'http://wowraider.ru/',
			func: function (text) {
				var body = $('<div class="news"></div>'), ul = $('<ul></ul>');
				$('.widget.news a', text).each(function (i, e) {
			        if (i == 0) {
				        body.append('<h1>'+this.innerHTML+'</h1>');
			        } else {
				        ul.append($('<li></li>').text(this.innerHTML));
			        }

		        });
		        body.append(ul);
				return body;
			}
		},
		'blue': {
			title: 'Синие посты',
			url: 'http://rublues.wowraider.ru/index.cdiml',
			func: function (text) {
				var body = $('<div class="blue"></div>'), ul = $('<ul></ul>');
				$('.widget.bluepost a', text).each(function (i, e) {
					if (i == 0) {
						body.append('<h1>'+this.innerHTML+'</h1>');
					} else {
						ul.append($('<li></li>').text(this.innerHTML));
					}

				});
				body.append(ul);
				return body;
			}
		},
		'search': {
			title: 'Поиск',
			url: 'http://wowraider.ru/splash.cdiml',
			func: function (text) {
				var body = $('<div class="search"></div>'), div = [],ul = null;
				$('.widget.mini', text).each(function (i, e) {
					div[i] = $('<div class="mini"></div>');
					ul = $('<ul></ul>');
					$('a', e).each(function (j, e) {
						if (j == 0) {
							div[i].append('<h1>'+this.innerHTML.split(' ищут').join('')+'</h1>');
						} else if (j == 1) {
						} else {
							if (this.className) {
								ul.append($('<li class="inline"></li>').html('<img src="/images/wowicons/class/'+this.className.split(' cl')[1]+'.gif">' + this.innerHTML));
								ul.addClass('icons');
							} else {
								ul.append($('<li></li>').html(this.innerHTML));
							}
						}
					});
					div[i].append(ul);
				});
				body.append(div[0]);
				body.append(div[2]);
				body.append(div[1]);
				return body;
			}
		}
	};

	function changeSD(title, url) {
		if (opera.contexts.speeddial) {
			opera.contexts.speeddial.title = 'WoW RaideR: ' + title;
			opera.contexts.speeddial.url = url;
		}
	}

	addEventListener( 'storage', function () {
		currentFeed = widget.preferences['feed'] || 'news';
		loadFeed();
		feedIntreval = widget.preferences['interval'] || 3600;

		changeSD(feedsOptions[currentFeed].title, feedsOptions[currentFeed].url);

		if (intervalId) {
			clearInterval(intervalId);
			intervalId = setInterval(loadFeed, feedIntreval*1000);
		}
	}, false);

	changeSD(feedsOptions[currentFeed].title, feedsOptions[currentFeed].url);

	function loadFeed() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://wowraider.ru/splash.cdiml', true);
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return false;
			$('output').html(feedsOptions[currentFeed].func(this.responseText));
		};
		xhr.send(null);
	}

	loadFeed();
	intervalId = setInterval(loadFeed, feedIntreval*1000);
}, false);