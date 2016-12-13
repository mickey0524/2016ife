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
	addEvent($('delete'), 'click', function() {
		document.getElementById('select_content').value = '';
		reset();
	});

	addEvent($('search'), 'click', function() {
		search();
	});

	addEvent($('tree'), 'click', function(e) {
		//console.log(e);
		if(e.target && e.target.className == 'add') {
			var name = prompt('请输入您想要添加的节点');
			if(name != null && name != '') {
				var parent = e.target.parentNode.parentNode;
				var newNode = document.createElement('div');
				newNode.className = 'nodebody_visible';
				newNode.innerHTML = '<div class="treenode"><span class="arrow arrow_empty"></span><span class="node_title">' + name + '</span><img class="add" src="images/add.png"><img class="delete" src="images/delete.png"></div>';
				parent.appendChild(newNode);
				// var arrow = parent.getElementsByClassName('arrow')[0];
				// if(arrow.classList.contains('arrow_empty') || arrow.classList.contains('arrow_right')) {
				// 	parent.style.display = 'block';
				// }
				open_div(parent);
			}
		}
	});

	addEvent($('tree'), 'click', function(e) {
		if(e.target && e.target.className == 'delete') {
			var parent = e.target.parentNode.parentNode.parentNode;
			parent.removeChild(e.target.parentNode.parentNode);
			// console.log(parent.childNodes[0]);
			// console.log(parent.getElementsByClassName('nodebody_visible'));
			if(parent.getElementsByClassName('nodebody_visible').length == 0) {
				parent.getElementsByClassName('arrow')[0].classList.remove('arrow_right');
				parent.getElementsByClassName('arrow')[0].classList.remove('arrow_down');
			}
		}

	});

	addEvent($('tree'), 'click', function(e) {
		//console.log(e);
		if(e.target && e.target.className == 'node_title') {
			var parent = e.target.parentNode.parentNode;
			var arrow = parent.getElementsByClassName('arrow')[0];
			if(arrow.classList.contains('arrow_right')) {
				open_div(parent);
			}
			else if(arrow.classList.contains('arrow_down')) {
				close_div(parent);
			}
		}
	});
}

function reset() {
	var spanList = document.getElementsByClassName('node_title');
	for(var i = 0; i < spanList.length; i++) {
		spanList[i].style.color = '#87CEFA';
	}
}

function open_div(node) {
	//console.log(node);
	var arrow = node.getElementsByClassName('arrow')[0];
	arrow.classList.remove('arrow_empty');
	arrow.classList.remove('arrow_right');
	arrow.classList.add('arrow_down');
	for(var i = 0; i < node.childNodes.length; i++) {
		if(node.childNodes[i].className == 'nodebody_visible') {
			node.childNodes[i].style.display = 'block';
		}
	}
}

function close_div(node) {
	//console.log(node);
	var arrow = node.getElementsByClassName('arrow')[0];
	arrow.classList.remove('arrow_down');
	arrow.classList.add('arrow_right');
	for(var i = 0; i < node.childNodes.length; i++) {
		if(node.childNodes[i].className == 'nodebody_visible') {
			node.childNodes[i].style.display = 'none';
			console.log(node.childNodes[i].style);
		}
	}
}

function search() {
	var search_content = $('select_content').value.trim();
	if(search_content == '') {
		alert("请输入想要搜索内容");
	}
	else {
		var nodeList = document.getElementsByClassName('nodebody_visible');
		var result_num = 0;

		for(var i = 0; i < nodeList.length; i++) {
			var child = nodeList[i].getElementsByClassName('node_title')[0];
			if(child.innerHTML == search_content) {
				child.style.color = 'red';
				result_num += 1;
				console.log(child.style);
				if(nodeList[i].style.display == 'none') {
					open_div(nodeList[i].parentNode);
					// console.log(10);
					// console.log(nodeList[i]);
				}
			}
		}
		$('result').innerHTML = '找到了' + result_num + '个符合要求的节点';
	}
}
