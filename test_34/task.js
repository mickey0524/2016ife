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
				console.log(turn);
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
			console.log('go');
			controller.move();
		},
		'TUN LEF' : function() {
			console.log('tun lef');
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
	var btn = document.getElementById('run');
	btn.onclick = function() {
		var text = document.getElementById('input').value.trim().toUpperCase();
		//console.log(text);
		handle[text]();
	}
})();