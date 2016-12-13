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
	return document.getElementById(id);
}

window.onload = function() {
	addEvent($("bianli"), 'click', preOrder);
}

function reset() {
	var divLists = document.getElementsByTagName('div');
	for(var i = 0; i < divLists.length; i++) {
		divLists[i].style.backgroundColor = '#fff';
	}
}

var divList = [];
var isFind = false;

function resursion(node, string) {
	if(node == null || isFind) {
		return ;
	}
	divList.push(node);
	console.log(node.nodeValue);
	if(node.innerHTML == string) {
		isFind = true;
	}
	for(var i in node.childNodes) {
		if(node.childNodes[i].nodeType != 1) {
			continue;
		}
		resursion(node.childNodes[i], string);
	}
}

function changeColor() {
	//console.log(divList);
	var i = 0;
	divList[0].style.backgroundColor = 'blue';
	var timer = setInterval(function() {
		i += 1;
		if(i < divList.length) {
			divList[i - 1].style.backgroundColor = '#fff';
			divList[i].style.backgroundColor = 'blue';
		}
		else {
			clearInterval(timer);
			if(!isFind) {
				divList[i - 1].style.backgroundColor = '#fff';
				alert('没有找到您输入的字符串');
			}
		}
	}, 500);
}

function preOrder() {
	var select = $('select').value;
	//console.log(select);
	reset();
	resursion($('root'), select);
	changeColor();
}