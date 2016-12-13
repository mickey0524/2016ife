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
	return document.querySelectorAll(id);	
}

var res_content = [{tip : '必填，长度为4~16个字符', correct : '名称可用', wrong : '名称格式错误', ispassed : 'false'},
				   {tip : '只能输入英文字母和数字', correct : '密码可用', wrong : '密码格式错误', ispassed : 'false'},
				   {tip : '再次输入相同密码', correct : '密码熟人一致', wrong : '两次密码输入不一致', ispassed : 'false'},
				   {tip : '必须带有@字符', correct : '邮箱格式正确', wrong : '邮箱格式错误', ispassed : 'false'},
				   {tip : '长度为11位的数字', correct : '手机格式正确', wrong : '手机格式错误', ispassed : 'false'}];

var inputs = $('.content');
[].forEach.call(inputs, function(e) {
	addEvent(e, 'focus', function() {
		var res = e.parentNode.nextElementSibling;
		res.style.display = 'block';
	});
	addEvent(e, 'blur', function() {
		var res = e.parentNode.nextElementSibling;
		if(e.value == '') {
			res.style.display = 'none';
		}
		else {
			var id_num = res.classList[1].slice(4);
			check_up(id_num, e);
			res.style.display = 'block';
		}
	});
});

window.onload = function() {
	addEvent($('#submit')[0], 'click', function() {
		var pass = true;
		console.log(pass);
		for(var i = 0; i < res_content.length; i++) {
			console.log(i + res_content[i].ispassed);
			if(!res_content[i].ispassed) {
				pass = false;
				break;
			}
		}
		console.log(pass);
		if(pass) {
			alert('恭喜您，已经成功上交');
		}
		else {
			alert('不好意思，还有错误!');
		}
	});
}

function check_up(id, e) {
	var flag = true;
	var content = e.value;
	console.log(id);
	switch (parseInt(id)) {
		case 1 : var length = contentLength(content);
					console.log(length);
				 if(length < 4 || length > 16) {
				 	flag = false;
				 	console.log(length);
				 }
				 break;
		case 2 : if(content.match(/[^a-zA-Z0-9]/)) {
					flag = false;
				 }
				 break;
		case 3 : var last_input = $('#pwd')[0].value;
				 if(content != last_input) {
				 	flag = false;
				 }
				 break;
		case 4 : if(!content.match(/@/)) {
					flag = false;
				 }
				 break;
		case 5 : if(content.length != 11 || content.match(/[^0-9]/)) {
					flag = false;
				 }
		default:
			break;
	}
	var class_name = '.res_' + id;
	if(flag) {
		e.style.border = '2px solid green';
		$(class_name)[0].innerHTML = res_content[id - 1].correct;
		$(class_name)[0].style.color = 'green';
		res_content[id - 1].ispassed = 'true';
	}
	else {
		e.style.border = '2px solid red';
		$(class_name)[0].innerHTML = res_content[id - 1].wrong;
		$(class_name)[0].style.color = 'red';
		res_content[id - 1].ispassed = 'false';
	}
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