var $ = function(id) {
	return document.getElementById(id);
}

var arr = [];

function refresh() {
	var num_list = $("container");
	num_list.innerHTML = '';
	console.log(num_list);
	for(var num in arr) {
		var block = document.createElement("div");
		block.innerHTML = arr[num];
		num_list.appendChild(block);
	}
}

function input(direction) {
	var num = $("num_in").value;
	num = num.trim();
	if(!num.match(/^[0-9]+$/)) {
		alert("请输入数字");
	}
	else {
		if(direction == "left") {
			arr.unshift(num);
		}
		else {
			arr.push(num);
		}
		refresh();
	}
}

$("left_in").onclick = function() {
	var num = $("num_in").value;
	if(!num.match(/^[0-9]+$/)) {
		alert("请输入数字");
	}
	else {
		arr.unshift(num);
		refresh();
	}		
	$("num_in").value = "";
}

$("right_in").onclick = function() {
	var num = $("num_in").value;
	if(!num.match(/^[0-9]+$/)) {
		alert("请输入数字");
	}
	else {
		arr.push(num);
		refresh();
	}		
	$("num_in").value = "";
}

$("left_out").onclick = function() {
	arr.shift();
	refresh();
}

$("right_out").onclick = function() {
	arr.pop();
	refresh();
}