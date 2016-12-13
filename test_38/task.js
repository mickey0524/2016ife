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

/**获得id对应的DOM元素
@Param(id) : String id值
@Return : id所对应的DOM元素
**/
var $ = function(id) {
	return document.getElementById(id);
}

var data = {
	thContent : ['姓名', '语文', '数学', '英语', '总分'],
	tdContent : [['小明', '80', '90', '70', '240'],
				 ['小红', '90', '60', '90', '240'],
				 ['小亮', '60', '100', '70', '230']]
};

function generate_table() {
	var table = $('table');
	var thead = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
	
	var thead_content = '';
	for(var i = 0; i < data.thContent.length; i++) {
		var th = document.createElement('th');
		var text = document.createTextNode(data.thContent[i]);
		th.appendChild(text);
		if(i > 0) {
			var top_arrow = document.createElement('div');
			top_arrow.className = 'top_arrow';
			var bottom_arrow = document.createElement('div');
			bottom_arrow.className = 'bottom_arrow';
			th.appendChild(top_arrow);
			th.appendChild(bottom_arrow);
			rank(top_arrow, bottom_arrow, i);
		}
		thead.appendChild(th);
	}

	addTd();
	// var top_arrow = document.querySelectorAll('.top_arrow');
	// [].forEach.call(top_arrow, function(e) {
	// 	addEvent(e, 'click', function() {
	// 		console.log(e.parentNode);
	// 	});
	// })
}

function addTd() {
	var tbody = table.getElementsByTagName('tbody')[0];
	var tbody_content = '';
	for(var i = 0; i < data.tdContent.length; i++) {
		var tr = document.createElement('tr');
		var tr_content = '<tr>';
		for(var j = 0; j < data.tdContent[i].length; j++) {
			tr_content = tr_content + '<td>' + data.tdContent[i][j] + '</td>';
		}
		tr_content += '</tr>'
		tbody_content += tr_content;
	}
	tbody.innerHTML = tbody_content;
}

function rank(top_arrow, bottom_arrow, index) {

	addEvent(top_arrow, 'click', function() {
		data.tdContent.sort(function(a, b) {
			return a[index] - b[index];
		});
		addTd();
	});

	addEvent(bottom_arrow, 'click', function() {
		data.tdContent.sort(function(a, b) {
			return b[index] - a[index];
		})
		addTd();
	});
}

window.onload = function() {
	generate_table();
}