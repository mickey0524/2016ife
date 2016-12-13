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
	var button = $("bianli");
	addEvent(button, 'click', preOrder);
}

var divList = [];

function resursion(node) {
	if(node == null) {
		return ;
	}
	divList.push(node);
	arguments.callee(node.firstElementChild);
	arguments.callee(node.lastElementChild);
}

function changeColor() {
	var i = 0;
	divList[0].style.backgroundColor = 'blue';
	var timer = setInterval(function(argument) {
		i += 1;
		if(i < divList.length) {
			console.log(divList[i - 1]);
			divList[i - 1].style.backgroundColor = '#fff';
			divList[i].style.backgroundColor = 'blue';
		}
		else {
			clearInterval(timer);
			divList[divList.length - 1].style.backgroundColor = '#fff';
		}
	}, 500);
}

function reset() {
	var divs = document.getElementsByTagName('div');
	for(var i = 0; i < divs.length; i++) {
		divs[i].style.backgroundColor = '#fff';
	}
}

function preOrder() {
	reset();
	var node = document.getElementsByClassName("root")[0];
	resursion(node);
	changeColor();
}


