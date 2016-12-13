var $ = function(id) {
	return document.getElementById(id);
}

var arr = [];

var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
              '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];

function refresh() {
	var num_list = $("contained");
	num_list.innerHTML = "";
	for(var i in arr) {
		var num = document.createElement("div");
		num.style.height = arr[i] + "px";
		num.style.background = colors[Math.floor(Math.random() * colors.length)];
		num_list.appendChild(num);
	}
}

$("left_in").onclick = function() {
	if(arr.length > 60)
		return ;
	var num = $("num_in").value;
	num = parseInt(num);
	if(num < 10 || num > 100) {
		alert("输入的数字必须在10-100之间");
	}
	else {
		arr.unshift(num);
		refresh();
	}
}

$("right_in").onclick = function() {
	if(arr.length > 60)
		return ;
	var num = $("num_in").value;
	num = parseInt(num);
	if(num < 10 || num > 100) {
		alert("输入的数字必须在10-100之间");
	}
	else {
		arr.push(num);
		refresh();
	}
}

$("left_out").onclick = function() {
	arr.shift();
	refresh();
}

$("right_out").onclick = function() {
	arr.pop();
	refresh();
}

$("sort").onclick = function() {
	arr.sort(function(value1, value2) {
		return value2 - value1;
	});
	refresh();
}
