function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } 
    else if (ele.attachEvent) {
        ele.attachEvent("on" + event, hanlder);
    } 
    else {
        ele["on" + event] = hanlder;
    }
}

var $ = function(id) {
	return document.getElementById(id);
}

var arr_tag = [];
var arr_hobby = [];
var tagList = $("tag_result");

function refresh(result, arr) {
	$(result).innerHTML = arr.map(function(d) {
		return "<SPAN>" + d + "</SPAN>";
	}).join("");
}

function input(content, arr) {
	var array = content.split(/[^a-zA-Z0-9\u4E00-\u9FA5]+/).filter(function(e) {
		if(e != null && e.length > 0) {
			return true;
		}
		else {
			return false;
		}
	});
	array = array.filter(function(e) {

		for(var i in arr) {
			console.log(i);
			if(e == arr[i]) {
				return false;
			}
		}
		return true;
	});
	return array;
}

function check_up(array) {
	if(array.length <= 10) {
		return array;
	}
	else {
		while(array.length > 10) {
			array.shift();
		}
		return array;
	}
}

$("input").onclick = function() {
	var content = $("tag_input").value.trim();
	if (content == "") {
		alert("输入内容不能为空");
	}
	else {
		var array = input(content, arr_tag);
		arr_tag = arr_tag.concat(array);
		arr_tag = check_up(arr_tag);
		refresh("tag_result", arr_tag);
	}
}	

$("comfirm").onclick = function() {
	var content = $("hobby_input").value.trim();
	if (content == "") {
		alert("输入内容不能为空");
	}
	else {
		var array = input(content, arr_hobby);
		arr_hobby = arr_hobby.concat(array);
		arr_hobby = check_up(arr_hobby);
		refresh("hobby_result", arr_hobby);
	}
}

addEventHandler(tagList, 'mouseover', function(e) {
	if(e.target && e.target.nodeName == "SPAN") {
		e.target.firstChild.insertData(0, '点击删除');
		e.target.style.background = 'red'; 
	}
});

addEventHandler(tagList, 'mouseout', function(e) {
	if(e.target && e.target.nodeName == "SPAN") { 
		e.target.firstChild.deleteData(0, 4);
		e.target.style.background = '#87CEFA';
	}
});

addEventHandler(tagList, 'click', function(e) {
	if(e.target && e.target.nodeName == "SPAN") { 
		for(var i = 0; i < tagList.childNodes.length; i++) {
			if(tagList.childNodes[i] == e.target) {
				arr_tag.splice(i, 1);
			}
		}
		tagList.removeChild(e.target);
	}
});
