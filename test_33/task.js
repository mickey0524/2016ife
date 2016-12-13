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

/***封装的棋子类***/

function chess(x_coordinate, y_coordinate, front) {
	this.x_coordinate = x_coordinate || 5;   //默认起始坐标为5
	this.y_coordinate = y_coordinate || 5;
	this.front = front || 0;        //0代表上，1代表右，以此类推
}

chess.prototype = {
	constructor : chess,

	go : function() {
		console.log(this.front);
		switch(this.front) {
			case 0 : if(this.x_coordinate > 1) this.x_coordinate -= 1;break;
			case 1 : if(this.y_coordinate < 10) this.y_coordinate += 1;break;
			case 2 : if(this.x_coordinate < 10) this.x_coordinate += 1;break;
			case 3 : if(this.y_coordinate > 1) this.y_coordinate -= 1;break;
			default : break;
		}
		this.reset();
	},

	turn_left : function() {
		if(this.front == 0) {
			this.front = 3;
		}
		else {
			this.front = (this.front - 1) % 4;
		}
		this.reset();
	},

	turn_right : function() {
		this.front = (this.front + 1) % 4;
		this.reset();
	},

	turn_bac : function() {
		this.front = (this.front + 2) % 4;
		this.reset();
	},

	reset : function() {

		var table = $('Table').firstElementChild;
		var td_list = table.getElementsByTagName('div');
		if(td_list.length != 0) {
			td_list[0].parentNode.style.backgroundColor = '#fff';
			td_list[0].parentNode.removeChild(td_list[0]);
		}

		//console.log(table.childNodes);
		var tr = null, th = null;
		//console.log(this.x_coordinate);
		for(var i = 0; i < table.childNodes.length; i++) {
			//console.log(table.childNodes[i]);

			if(table.childNodes[i].nodeType == '1') {
				if(table.childNodes[i].firstElementChild.innerHTML == this.x_coordinate) {
					tr = table.childNodes[i];
					//console.log(tr);
					break;

				}
			}
		}
		var num = 0;

		for(i = 0; i < tr.childNodes.length; i++) {
			if(tr.childNodes[i].nodeType == '1') {
				num += 1;
			}
			if(num == this.y_coordinate + 1) {
				th = tr.childNodes[i];
				break;
			}
		}
		th.style.backgroundColor = 'red';
		var div = document.createElement('div');
		switch(this.front) {
			case 0 : div.className = 'top'; break;
			case 1 : div.className = 'right'; break;
			case 2 : div.className = 'bottom'; break;
			case 3 : div.className = 'left'; break;
			default: break;
		}
		th.appendChild(div);
	}
}

window.onload = function() {
	var chess_item = new chess(1, 2, 3);
	chess_item.reset();
	addEvent($('run'), 'click' ,function() {
		var input = $('input').value.trim();
		//console.log(input);
		switch(input) {
			case 'GO' : chess_item.go(); break;
			case 'TUN LEF' : chess_item.turn_left(); break;
			case 'TUN RIG' : chess_item.turn_right(); break;
			case 'TUN BAC' : chess_item.turn_bac(); break;
			default: break;
		}
	});
}