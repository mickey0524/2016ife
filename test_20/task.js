var $ = function(id) {
	return document.getElementById(id);
}

var arr = [];

function refresh(str) {
	str = str || "";
	$("result").innerHTML = arr.map(function(d) {
		if(str != null && str.length > 0) {
			d = d.replace(new RegExp(str, "g"), "<span>" + str + "</span>");
		}
		console.log(d);
		return "<div>" + d + "</div>";

	}).join("");
}

$("input").onclick = function() {
	var content = $("textArea").value.trim();
	if (content == "") {
		alert("输入内容不能为空");
	}
	else {
		array = content.split(/[^a-zA-Z0-9\u4E00-\u9FA5]+/).filter(function(e) {
			if(e != null && e.length > 0) {
				return true;
			}
			else {
				return false;
			}
		});
		arr = arr.concat(array);
		refresh();
	}
}	

$("select_btn").onclick = function() {
	var content = $("select_input").value.trim();
	refresh(content);
}
