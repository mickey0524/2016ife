
/**
 *行星类
 *@Param {int} coordinatesX 行星的圆心X轴坐标，参照的是左上角
 *@Params {int} coordinatesY 行星的圆心Y轴坐标，参照的是左上角
 *@Param {int} radius 行星的半径
 */

function Planet(coordinatesX, coordinatesY, radius) {
	this.coordinatesX = coordinatesX || 300;
	this.coordinatesY = coordinatesY || 300;
	this.radius = radius || 100;
	this.spacecrafts = [];
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
		var spacecraft = new Spacecraft(this.getId(), this.coordinatesX, this.coordinatesY, this.radius, speed, consumption, addition);
		this.spacecrafts.push(spacecraft);
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