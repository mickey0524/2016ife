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
						pos.turn = (pos.turn + 3) % 4;
					}
					else if(force == 2) {
						pos.rotate += 90;
						pos.turn = (pos.turn + 1) % 4;
					}
					else if(force == 3) {
						pos.rotate += 180;
						pos.turn = (pos.turn + 2) % 4;
					}
				}
				else {
					pos.rotate = rotate;
					pos.turn = rotate / 90;
				}
				pos.actoin_block.style.transform = 'rotate(' + pos.rotate +  'deg)';
			}
			//在面前建立墙或者染色
			function build_dye(color) {
				var build_block_num = null;
				switch (pos.turn) {
					case 0 : if(pos.x_axis > 0) build_block_num = (pos.x_axis - 1) * 10 + pos.y_axis; break;
					case 1 : if(pos.y_axis < 9) build_block_num = pos.x_axis * 10 + (pos.y_axis + 1); break;
					case 2 : if(pos.x_axis < 9) build_block_num = (pos.x_axis + 1) * 10 + pos.y_axis; break;
					case 3 : if(pos.y_axis > 0) build_block_num = pos.x_axis * 10 + (pos.y_axis - 1); break;
					default : break;
				}
				var build_block = document.getElementById('container').childNodes[build_block_num];
				if(color == undefined) {
					if(build_block.classList.contains('block_wall')) {
						console.log('The wall exist');
					}
					else {
						build_block.classList.add('block_wall');
					}
				}
				else {
					if(build_block.classList.contains('block_wall')) {
						build_block.style.backgroundColor = color; 				
					}
					else {
						console.log('No wall to dye');
					}
				}
			}
			//判断面前的方块是否能够到达
			function is_available(pos_x, pos_y) {
				var block_num = pos_x * 10 + pos_y;
				console.log(pos_x + " " + pos_y);
				console.log(document.getElementById('container').childNodes[block_num].className);
				return !document.getElementById('container').childNodes[block_num].classList.contains('block_wall');
			}
			//毕竟向四个方向移动距离终点的距离
			function createOffsets(distance) {
				var offsets = [
					{x : 0, y : -1}, {x : 0, y : 1},
					{x : 1, y : 0}, {x : -1, y : 0}].map(function(item) {
						item.weight = item.x * distance.x + item.y * distance.y;
						return item;
					});

				offsets.sort(function(a, b) {
					return b.weight - a.weight;
				});
				return offsets;
			}
			/*移动方块*/
			function line(x, y) {
				if(x == 0 && y == 1) {
					turn(null, 90);
					move();
				}
				else if(x == 0 && y == -1) {
					turn(null, 270);
					move();
				}
				else if(x == 1 && y == 0) {
					turn(null, 180);
					move();
				}
				else {
					turn(null, 0);
					move();
				}
			}

			// function sleep(n) {   
		 //        var start = new Date().getTime();   
		 //        while(true) {
		 //        	if(new Date().getTime() - start > n) {
		 //        		break;
		 //        	}   
		 //        }
		 //        return true;
		 //    } 
		 	var visited = {};
		 	/*
		 	 *深度优先遍历去找路径
		 	 *
		 	 *
		 	 */
			function find_path(end_x, end_y) {
				// if(visited == undefined) {
				// 	visited = {};
				// }
				console.log(visited);
				if(pos.x_axis == end_x && pos.y_axis == end_y) {
					visited = {};
					return true;
				}

				var offsets = createOffsets({x : end_x - pos.x_axis, y : end_y - pos.y_axis});
				for(var i = 0; i < offsets.length; i++) {
					//console.log(0 == -0);
					
					var visit = [pos.x_axis + offsets[i].x, pos.y_axis + offsets[i].y];
					if(!visited[visit] && is_available(visit[0], visit[1])) {
						line(offsets[i].x, offsets[i].y);
						visited[visit] = 'true';
						Thread.sleep(5000);  //不知道为啥这样就能让方块一步一步走
						if(find_path(end_x, end_y)) {
							return true;
						}
						line(-offsets[i].x, -offsets[i].y);				
						console.log('go_back');
					}
				}
			}

			return {
				turn : turn,
				move : move,
				build_dye : build_dye,
				find_path : find_path
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
		},
		'BUILD' : function() {
			controller.build_dye();
		},
		'BRU' : function(color) {
			controller.build_dye(color);
		},
		'FIND PATH' : function(end_x, end_y) {
			controller.find_path(end_x, end_y);
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
					if(handle[text_content[i]] || handle[text_content[i].slice(0, text_content[i].length - 2)]
											   || handle[text_content[i].slice(0, 3)]
											   || text_content[i].slice(0, 3) == 'MOV') {
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
				var index = text_content[i].search('#');
				//console.log(text_content[i]);
				if(index != -1) {		
					handle['BRU'](text_content[i].slice(index, text_content[i].length));
				}
				else if(text_content[i].search(',') != -1) {
					var pos = text_content[i].search(',');
					handle['FIND PATH'](text_content[i].slice(pos - 1, pos), text_content[i].slice(pos + 1, pos + 2));
				}	
				else {		
					//console.log('aa');
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

	document.getElementById('build_wall').onclick = function() {
		var build_num = Math.floor(Math.random() * 100);
		var container = document.getElementById('container');
		var build_block = container.childNodes[build_num];
		build_block.classList.add('block_wall');
	}

	document.getElementById('clear').onclick = function() {
		var coordinate = document.getElementById('coordinate').value.split(',');
		var x_coordinate = coordinate[0].slice(1, coordinate[0].length);
		var y_coordinate = coordinate[1].slice(0, coordinate[1].length - 1);

		var clear_num = (Number(x_coordinate) - 1) * 10 + Number(y_coordinate) - 1;
		//console.log(clear_num);
		var clear_block = document.getElementById('container').childNodes[clear_num];
		
		clear_block.className = 'block';
		//console.log(clear_block.className + " " + clear_block.style.backgroundColor);
		clear_block.style.backgroundColor = '#fff';
	}

})();