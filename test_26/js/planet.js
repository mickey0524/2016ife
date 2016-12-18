
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

Planet.prototype.newSpacecraft = function() {
	if(this.spacecrafts.length == 4) {
		alert('轨道上的飞船已经有4个了，不允许新的飞船起飞!');
	}
	else {
		var spacecraft = new Spacecraft(this.getId(), this.coordinatesX, this.coordinatesY, this.radius);
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
	switch(data.command) {
		case 'begin' : for(var i = 0; i < this.spacecrafts.length; i++) {this.spacecrafts[i].begin(data.id)}; break;
		case 'stop' : for(var i = 0; i < this.spacecrafts.length; i++) {this.spacecrafts[i].stop(data.id)}; break;
		case 'destory' : for(var i = 0; i < this.spacecrafts.length; i++) {
							this.spacecrafts[i].destory(data.id);
							if(this.spacecrafts[i].id == data.id) {
								this.spacecrafts.splice(i, 1);
							}
						 }; 
						 break;
		default : break;
	}
} 