function setSpeedDial(title, url)
{
	if (opera.contexts.speeddial) {
		opera.contexts.speeddial.title = 'WoW RaideR: ' + title;
		opera.contexts.speeddial.url = url;
	}
}

function ajaxGet(url, successCallback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			successCallback(this.responseText);
		}
	};
	xhr.send(null);
}

var feedsParsers = {
	news: function (data) {
		var body = initElements(data), ul = $('<ul></ul>');
		for (var i = 0, maxi = data.data.length; i < maxi; i++) {
			ul.append('<li><a href="'+data.data[i].url+'">'+data.data[i].title+'</a></li>')
		}
		body.append(ul);
		return body;
	},
	blogs: function (data) {
		var body = initElements(data), ul = $('<ul></ul>');
		return body;
	}
}

function initElements(data)
{
	var body = $('<div class="news"></div>');
	body.append('<h1>'+data.title+'</h1>');
	return body;
}