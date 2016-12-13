var $ = function(id) {
	return document.getElementById(id);
}

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

var tableData = [['小明', '80', '90', '70', '240'],
				 ['小红', '90', '60', '90', '240'],
				 ['小亮', '60', '100', '70', '230']];

function init_table() {
	var tbody = $('tbody');
	for(var i = 0; i < 10; i++) {
		for(var j = 0; j < tableData.length; j++) {
			var tr = document.createElement('tr');
			for(var k = 0; k < tableData[j].length; k++) {
				var td = document.createElement('td');
				td.innerHTML = tableData[j][k];
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
	}
}

window.onload = function() {
	init_table();
}

 	

window.onscroll = function() {
	var theadHeight = $('thead').offsetHeight;
	var tbodyHeight = $('tbody').offsetHeight;
	var tableHeight = Number($('thead').offsetHeight) + Number($('tbody').offsetHeight);
	console.log(theadHeight + ' ' + tbodyHeight);
	console.log(document.body.scrollTop);
	console.log(tableHeight);
	if(document.body.scrollTop > tableHeight) {
		$('thead').style.display = 'none';
	}
	else {
		$('thead').style.display = 'block';
	}
}