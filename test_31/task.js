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

var data = {
	'北京' : ['北京大学', '清华大学', '北京邮电大学'],
	'上海' : ['复旦大学', '上海交通大学', '上海大学'],
	'广州' : ['中山大学', '华南理工大学', '暨南大学']
}

function radioChange() {
	if($('#s1').checked) {
		$('.school').style.display = 'block';
		$('.work').style.display = 'none';
	}
	else {
		$('.school').style.display = 'none';
		$('.work').style.display = 'block';
	}
}

function selectDistrict() {
	var city = $('#city');
	var college = $('#college');
	var selected = city.options[city.selectedIndex].innerHTML; 
	var school = [];
	for(var i = 0; i < data[selected].length; i++) {
		school.push('<option>' + data[selected][i] + '</option>');
	}
	college.innerHTML = school.join('');
}