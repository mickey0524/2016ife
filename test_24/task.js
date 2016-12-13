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

clickDiv = null;

window.onload = function() {
	addEvent($('#root'), 'click', function(e) {
		if(e.target &&  e.target.nodeName == 'DIV') {
			reset();
			e.target.style.backgroundColor = 'blue';
			clickDiv = e.target;
		}
	});
	addEvent($('#delete'), 'click', deleteDiv);
	addEvent($('#add'), 'click', insertDiv);
}

function reset() {
	var divList = document.querySelectorAll('div');
	//console.log(divList);
	for(var i = 0; i < divList.length; i++) {
		divList[i].style.backgroundColor = '#fff';
	}
}

function deleteDiv() {
	if(clickDiv == null) {
		alert("请选择要删除的元素");
	}
	else {
		var parent = clickDiv.parentNode;
		parent.removeChild(clickDiv);
	}
}

function insertDiv() {
	if(clickDiv == null) {
		alert("请选择要添加子元素的父亲节点");
	}
	else {
		var add_content = $('#content').value.trim();
		var newDiv = document.createElement('div');
		newDiv.innerHTML = add_content;
		clickDiv.appendChild(newDiv);
	}
}