
/**
 *选择器函数
 *@Param {String} selector 所选元素的选择器
 *@Return {Element} 返回选择的元素
 */
var $ = function(selector) {
	return document.querySelectorAll(selector);
}

/**
 *封装起来的事件处理函数
 *@Param {ELement} element 触发事件相应函数的元素
 *@Param {event} event 事件
 *@Param {function} listener 事件处理函数
 */
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

/**
 *添加新的飞船
 */
function addSpacecraft() {
	var speed, consumption, addition;

	var power = document.getElementsByName('power');
	for(var i = 0; i < power.length; i++) {
		if(power[i].checked) {
			var mes = power[i].nextElementSibling.innerHTML;
			mes = mes.replace(/[^0-9,]/g, '');
			mes = mes.split(',');
			speed = mes[0];
			consumption = mes[1];
		}
	}

	var energy = document.getElementsByName('energy');
	for(var i = 0; i < energy.length; i++) {
		if(energy[i].checked) {
			var mes = energy[i].nextElementSibling.innerHTML;
			mes = mes.replace(/[^0-9]/g, '');
			addition = mes;
		}
	}



	var id = planet.newSpacecraft(speed, consumption, addition);
	if(id != undefined) {
		var operate = document.createElement('div');
		operate.className = 'operate';
		operate.innerHTML = '对' + id + '号飞船下达指令:';

		var begin = createButton(id, '开始飞行', 'begin');
		var stop = createButton(id, '停止飞行', 'stop');
		var destory = createButton(id, '销毁', 'destory');		

		operate.appendChild(begin);
		operate.appendChild(stop);
		operate.appendChild(destory);
		$('.spacecrafts')[0].appendChild(operate);
	}	
}

/**
 *创建每个命令窗口飞船的按钮
 *@Param {int} id 飞船的id
 *@Param {String} text 按钮上的字
 *@Param {String} message 点击相应的按钮发送的消息
 */
function createButton(id, text, message) {
	var button = document.createElement('button');
	button.innerHTML = text;
	addEvent(button, 'click', function(e) {
		var possibly;
		timer = setInterval(function() {
			possibly = getPossibly();
			if(possibly > 1) {
				clearInterval(timer);
				sendCommand(id, message);
				if(e.target.innerHTML == '销毁') {
					$('.spacecrafts')[0].removeChild(e.target.parentNode);
				}	
			}
		}, 300);
	});	
	return button;
}

/**
 *模拟单次传播失败率
 */
function getPossibly() {
	var possibly = Math.ceil(Math.random() * 10);
	return possibly;
}

/**
 *给飞船发生消息
 *@Param {int} id 需要接受命令的飞船id
 *@Param {String} command 飞船接受的命令种类
 */
function sendCommand(id, command) {
	planet.command({
		id : id,
		command : command
	})
}

var planet = new Planet();

window.onload = function() {
	addEvent($('#new')[0], 'click', addSpacecraft);
}
