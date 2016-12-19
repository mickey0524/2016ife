
/**
 *宇宙飞船类  默认飞船出生在行星的正下方
 *@Param {int} id 宇宙飞船的id
 *@Param {int} coordinatesX 行星的圆心X轴坐标，参照的是左上角
 *@Params {int} coordinatesY 行星的圆心Y轴坐标，参照的是左上角
 *@Param {int} radius 行星的半径
 */

function Spacecraft(id, coordinatesX, coordinatesY, radius, speed, consumption, addition) {
	this.id = id;
	this.status = 0; //0代表停止，1代表起飞
	this.power = 100; //飞船的能量，是一个百分数
	this.planetcoordinatesX = coordinatesX;
	this.planetcoordinatesY = coordinatesY;
	this.planetRadius = radius;
	this.speed = Math.round(speed * 360 / (2 * Math.PI * (this.planetRadius + this.id * 30)));
	this.consumption = Number(consumption);
	this.addition = Number(addition);
	this.init();
}

/**
 *对飞船进行初始化，让其展现在宇宙中
 */
Spacecraft.prototype.init = function() {
	var distance = this.id * 30;
	var universe = document.getElementsByClassName('universe')[0];
	var spacecraft = document.createElement('div');
	this.plane = spacecraft;
	spacecraft.innerHTML = this.id + '号-' + this.power + '%';  
	spacecraft.className = 'spacecraft';
	spacecraft.style.left = this.planetcoordinatesX - 40 + 'px';  //40为飞船自己的宽度
	spacecraft.style.top = this.planetcoordinatesY + this.planetRadius + distance + 'px';
	spacecraft.style.transformOrigin = '40px ' + ( - (distance + Number(this.planetRadius))) + 'px';
	universe.appendChild(spacecraft);
	var self = this;
	setInterval(function() {
		self.power += self.addition;
		if(self.power > 100) {
			self.power = 100;
		}
		var description = spacecraft.innerHTML;
		var _index = description.indexOf('-');
		spacecraft.innerHTML = description.slice(0, _index + 1) + self.power + '%';
	}, 1000);
}

/**
 *飞船接受二进制命令，进行转换
 *@Param {String} command 接受的二进制命令
 */
Spacecraft.prototype.adapter = function(command) {
	var id = Number(command.slice(0, 1));
	if(id == this.id) {
		var binaryCommand = command.slice(1);
		switch(binaryCommand) {
			case '0001' : this.begin(); break;
			case '0010' : this.stop(); break;
			case '1100' : this.destory(); break;
			default : break;
		}
	}
}

/**
 *飞船开始飞行
 */
Spacecraft.prototype.begin = function() {
	var self = this;
	this.status = 1;

	this.timer = setInterval(function() {
		self.power -= self.consumption;
		var angle = self.plane.style.transform.replace(/[a-zA-Z()]/g, '');
		angle = Number(angle) + self.speed;
		self.plane.style.transform = 'rotate(' + angle + 'deg)';
		if(self.power <= 0) {
			self.stop(self.id);
		}
	}, 1000);
}


/**
 *飞船停止飞行
 */
Spacecraft.prototype.stop = function() {
	clearInterval(this.timer);
	this.status = 0;		
}

/**
 *飞船销毁
 */
Spacecraft.prototype.destory = function() {
	clearInterval(this.timer);
	this.plane.parentNode.removeChild(this.plane);
}