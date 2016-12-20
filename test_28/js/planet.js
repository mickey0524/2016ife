
/**
 *行星类
 *@Param {int} coordinatesX 行星的圆心X轴坐标，参照的是左上角
 *@Params {int} coordinatesY 行星的圆心Y轴坐标，参照的是左上角
 *@Param {int} radius 行星的半径
 *@Param {ELement} element 行星上的监视器
 */

function Planet(element, coordinatesX, coordinatesY, radius) {
	this.coordinatesX = coordinatesX || 300;
	this.coordinatesY = coordinatesY || 300;
	this.radius = radius || 100;
	this.spacecrafts = [];
	this.monitorScreen = element;
	this.init();
}


/**
 *对行星进行初始化，将其展现在宇宙中
 */

Planet.prototype.init = function() {
	var universe = document.getElementsByClassName('universe')[0];
	var planet = document.createElement('div');
	planet.className = 'planet';
	planet.style.left = (this.coordinatesX - this.radius) + 'px';
	planet.style.top = (this.coordinatesY - this.radius) + 'px';
	planet.style.width = this.radius * 2 + 'px';
	planet.style.height = this.radius * 2 + 'px'; 
	universe.appendChild(planet);
}

Planet.prototype.newSpacecraft = function(speed, consumption, addition) {
	if(this.spacecrafts.length == 4) {
		alert('轨道上的飞船已经有4个了，不允许新的飞船起飞!');
	}
	else {
		var spacecraft = new Spacecraft(this.getId(), this.coordinatesX, this.coordinatesY, this.radius, speed, consumption, addition, this);
		this.spacecrafts.push(spacecraft);

		var tr = document.createElement('tr');
		var power = '', energy = '';
		switch(speed) {
			case '30' : power = '前进号'; break;
			case '50' : power = '奔腾号'; break;
			case '80' : power = '超越号'; break;
			default: break;
		}
		switch(addition) {
			case '2' : energy = '劲量型'; break;
			case '3' : energy = '光能型'; break;
			case '4' : energy = '永久型'; break;
			default: break;
		}
		tr.innerHTML = '<td>' + spacecraft.id + '号</td>' + '<td>' + power + '</td>' + '<td>' + energy + '</td>' + '<td>停止</td>' + '<td>100%</td>';
		this.monitorScreen.appendChild(tr);

		return spacecraft.id;
	}
}

/**
 *去拿新飞船应该赋予的id
 */
Planet.prototype.getId = function() {
	var ids = [];
	for(var i = 0; i < this.spacecrafts.length; i++) {
		ids.push(this.spacecrafts[i].id);
	}
	for(var i = 1 ; i <= 4; i++) {
		if(ids.indexOf(i) == -1) {
			return i;
		}
	}
}

/**
 *指挥官发送命令格式
 *@Param {Object} data 发送的命令
 */
Planet.prototype.command = function(data) {
	var command = this.adapter(data);
	for(var i = 0; i < this.spacecrafts.length; i++) {
		this.spacecrafts[i].adapter(command);
		if(data.command == 'destory') {
			if(this.spacecrafts[i].id == data.id) {
				this.spacecrafts.splice(i, 1);
			}
			for(var j = 0; j < this.monitorScreen.childNodes.length; j++) {
				if(this.monitorScreen.childNodes[j].firstElementChild.innerHTML.slice(0, 1) == data.id) {
					this.monitorScreen.removeChild(this.monitorScreen.childNodes[j]);
				}
			}		
		}
	}
} 

/**
 *将指挥官命令格式转为二进制模式
 *@Param {Object} data 指挥官发送的命令
 *@Return {String} res 行星发送的二进制码
 */
Planet.prototype.adapter = function(data) {
	var res = data.id;
	switch(data.command) {
		case 'begin' : res += '0001'; break;
		case 'stop' : res += '0010'; break;
		case 'destory' : res += '1100'; break;
		default: break;
	}
	return res;
}

/**
 *处理飞船发过来的二进制消息，转为对象格式
 *@Param {String} data 飞船发过来的二进制消息
 */
Planet.prototype.binaryToStatus = function(data) {
	var id = data.slice(0, 1);
	var power = data.slice(5);
	var status = data.slice(1, 5);
	switch(status) {
		case '0010' : status = '停止'; break;
		case '0001' : status = '飞行'; break;
		case '1100' : status = '即将销毁'; break;
		default : break;
	}
	var trs = this.monitorScreen.getElementsByTagName('tr');
	for(var i = 0; i < trs.length; i++) {
		if(trs[i].firstElementChild.innerHTML.slice(0, 1) == id) {
			trs[i].childNodes[3].innerHTML = status;                        //当前飞行状态
			trs[i].childNodes[4].innerHTML = power + '%';                   //剩余能耗
			break;
		}
	}
}