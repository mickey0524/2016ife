/*function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}*/

(function() {
	var Width = 42;
	var Hight = 42;
	var controller = (function(){
		function create_chess(container, obj) {
			var fragment = document.createDocumentFragment();
			for(var i = 0; i < obj.x; i++) {
				for(var j = 0; j < obj.y; j++) {
					fragment.appendChild(create_block({
						i : i,
						j : j,
						x : obj.x,
						y : obj.y
					}));
				}
			}
			container.appendChild(fragment);
			container.style.width = obj.y * Width + 'px';
			container.style.height = obj.x * Hight + 'px';
			return create_action(container, obj);
		}

		function create_block(obj) {
			var block = document.createElement('div');
			block.className = 'block';
			if(obj.j === 0 && obj.i !== 0) {
				block.style.clear = 'both';
			}
			if(obj.i === obj.x - 1) {
				block.className += ' block_bottom';
			}
			if(obj.j === obj.y - 1) {
				block.className += ' block_right';
			}
			return block;
		}

		function create_action(container, obj) {
			var x_axis = Math.floor(Math.random() * obj.x);
			var y_axis = Math.floor(Math.random() * obj.y);
			var actoin_block = document.createElement('div');
			actoin_block.className = 'action';
			actoin_block.style.left = y_axis * Width + 'px';
			actoin_block.style.top = x_axis * Hight + 'px';
			container.appendChild(actoin_block);
			return {
				x_axis : x_axis,
				y_axis : y_axis,
				actoin_block : actoin_block,
				turn : 0,            //代表朝向
				rotate : 0           //代表旋转角度
			};
		}
		return (function(){
			var pos = create_chess(document.getElementById('container'), {
				x : 10,
				y : 10
			});

			function move(force) {
				var turn = force || pos.turn;
				//console.log(turn);
				switch(turn) {
					case 0 : pos.x_axis > 0 && pos.x_axis --; break;
					case 1 : pos.y_axis < 9 && pos.y_axis ++; break;
					case 2 : pos.x_axis < 9 && pos.x_axis ++; break;
					case 3 : pos.y_axis > 0 && pos.y_axis --; break;
					default: break;
				}
				pos.actoin_block.style.left = pos.y_axis * Width + 'px';
				pos.actoin_block.style.top = pos.x_axis * Hight + 'px';
			} 

			function turn(force, rotate) {
				if(rotate == undefined) {
					if(force == 1) {
						pos.rotate -= 90;
					}
					else if(force == 2) {
						pos.rotate += 90;
					}
					else if(force == 3) {
						pos.rotate += 180;
					}
				}
				else {
					pos.rotate = rotate;
					pos.turn = rotate / 90;
				}
				pos.actoin_block.style.transform = 'rotate(' + pos.rotate +  'deg)';
			}

			return {
				turn : turn,
				move : move
			};
		})();
	})();





	var handle = {
		'GO' : function() {
			//console.log('go');
			controller.move();
		},
		'TUN LEF' : function() {
			//console.log('tun lef');
			controller.turn(1);
		},
		'TUN RIG' :function() {
			controller.turn(2);
		},
		'TUN BAC' : function() {
			controller.turn(3);
		},
		'TRA LEF' : function() {
			controller.move(3);
		},
		'TRA TOP' : function() {
			controller.move(0);
		},
		'TRA RIG' : function() {
			controller.move(1);
		},
		'TRA BOT' : function() {
			controller.move(2);
		},
		'MOV LEF' : function() {
			controller.turn(null, 270);
			controller.move();
		},
		'MOV TOP' : function() {
			controller.turn(null, 0);
			controller.move();
		},
		'MOV RIG' : function() {
			controller.turn(null, 90);
			controller.move();
		},
		'MOV BOT' : function() {
			controller.turn(null, 180);
			controller.move();
		}
	};

	//将多余的行的标头去掉
	var textarea = document.getElementsByTagName('textarea')[0];
	textarea.onkeyup = function() {
		var title = document.getElementsByClassName('title')[0];
		var num = Number(title.lastElementChild.innerHTML);
		var text_content = document.getElementsByTagName('textarea')[0].value.split("\n");

		while(num > text_content.length) {
			title.removeChild(title.lastElementChild);
			num -= 1;
		}
	}

	textarea.onfocus = function() {
		document.onkeydown = function() {
			if(event.keyCode == 13) {

				var title = document.getElementsByClassName('title')[0];
				var num = Number(title.lastElementChild.innerHTML);
				var text_content = document.getElementsByTagName('textarea')[0].value.split("\n");
				var new_title;

				console.log(text_content.length + 1);
				while(num < (text_content.length + 1)) {
					new_title = document.createElement('div');
					num += 1;
					new_title.innerHTML = num;
					title.appendChild(new_title);
				}

				for(var i = 0; i < text_content.length; i++) {
					text_content[i] = text_content[i].trim();
					if(handle[text_content[i]] || handle[text_content[i].slice(0, text_content[i].length - 2)]) {
						title.childNodes[i].classList.remove('error');					
					}
					else {
						title.childNodes[i].classList.add('error');
					}
				}
			}
		}
	}

	document.getElementById('run').onclick = run;

	function run() {
		var text_content = document.getElementsByTagName('textarea')[0].value.split("\n");
		var i = 0;
		var timer = setInterval(function() {
			text_content[i] = text_content[i].trim();
			if(text_content[i] != '') {
				var flag = text_content[i].slice(text_content[i].length - 1);
				if(isNaN(parseInt(flag))) {
					handle[text_content[i]]();
				}
				else {
					for(var j = 0; j < Number(flag); j++) {
						handle[text_content[i].slice(0, text_content[i].length - 2)]();
					}
				}
			}
			i += 1;
			if(i == text_content.length) {
				clearInterval(timer);
			}
		}, 1000);
	}

	document.getElementById('refresh').onclick = function() {
		textarea.value = '';
		var title = document.getElementsByClassName('title')[0];
		while(title.firstElementChild != null) {
			title.removeChild(title.firstElementChild);
		}
		title.innerHTML = '<div>1<div>';
	}

	function sleep(d){
	  	for(var t = Date.now();Date.now() - t <= d;);
	}
})();