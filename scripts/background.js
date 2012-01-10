window.addEventListener('load', function() {
	var currentFeed = widget.preferences['feed'] || 'news';
	var feedIntreval = widget.preferences['interval'] || 60;
	var intervalId = null;
	addEventListener( 'storage', function () {
		currentFeed = widget.preferences['feed'] || 'news';
		loadFeed();
		feedIntreval = widget.preferences['interval'] || 60;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = setInterval(loadFeed, feedIntreval*1000);
		}
	}, false);


	function loadFeed() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://wowraider.ru/splash.cdiml', true);
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return false;
			$('body').html(feedsOptions[currentFeed](this.responseText));
		}
		xhr.send(null);
	}

	loadFeed();
	intervalId = setInterval(loadFeed, feedIntreval*1000);

	var feedsOptions = {
	'news': function (text) {
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
		},
		'blue': function (text) {
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
		},
		'search': function (text) {
			var body = $('<div></div>'), div = null,ul = null;
			$('.widget.mini', text).each(function (i, e) {
				div = $('<div class="mini"></div>')
				ul = $('<ul></ul>');
				$('a', e).each(function (i, e) {
					if (i == 0) {
						div.append('<h1>'+this.innerHTML+'</h1>');
					} else if (i == 1) {
			        } else {
						if (this.className) {
							ul.append($('<li class="inline"></li>').html('<img src="/images/wowicons/class/'+this.className.split(' cl')[1]+'.gif">' + this.innerHTML));
						} else {
							ul.append($('<li></li>').html(this.innerHTML));
						}
					}
				});
				div.append(ul);
				body.append(div);
			});
			return body;
		}
	};
}, false);