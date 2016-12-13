function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}

var $ = function(id) {
	return document.querySelector(id);	
}

window.onload = function() {
	addEvent($('#btn'), 'click', function() {
		var content = $('#content').value.trim();
		var length = contentLength(content);
		if(length == 0) {
			$('.res').innerHTML = '姓名不能为空';
			$('.res').style.color = 'red';
			$('#content').style.border = '2px solid red';
		}
		else if(length >= 4 && length <= 16) {
			$('.res').innerHTML = '名称格式正确';
			$('.res').style.color = 'green';
			$('#content').style.border = '2px solid green';	
		}		
		else {
			$('.res').innerHTML = '名称格式错误';
			$('.res').style.color = 'red';
			$('#content').style.border = '2px solid red';					
		}
	});
}

function contentLength (str) {
	var length = 0;
	for(var i = 0; i < str.length; i++) {
		var ch = str.charCodeAt(i);
		if(ch >= 0 && ch <= 128) {
			length += 1;
		}
		else {
			length += 2;
		}
	}
	return length;
}