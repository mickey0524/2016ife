
/*
 * 模拟守卫的操作
 */

function Guard(context, imageFactory, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.imageFactory = imageFactory;

    this.rotate = 0;
   
    this.init();
    // this.shoot();
}

/** 
 * 初始化将守卫显示在屏幕上
 */
Guard.prototype.init = function() {
    this.context.drawImage(this.imageFactory.guard, this.x, this.y, this.width, this.height);
}

/**
 * 模拟守卫的旋转操作
 */
Guard.prototype.rotating = function() {
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(this.rotate * Math.PI / 180);
    this.context.clearRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.context.restore();
    this.rotate += 3;
    this.draw();
}

Guard.prototype.draw = function() {
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(this.rotate * Math.PI / 180);        
    this.context.drawImage(this.imageFactory.guard, -this.width / 2, -this.height / 2, this.width, this.height);
    this.context.restore();
}

/**
 * 当游戏重新开始的时候，删除上一局的守卫
 */
Guard.prototype.deleteGuard = function() {
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(this.rotate * Math.PI / 180);
    this.context.clearRect(-17, -17, 34, 34);
    this.context.restore();
}

/**
 * 当人物进入守卫射程之后，守卫自动发射子弹
 * @Param {Object} person 守卫需要判断敌人是否进入自己的射程
 */
Guard.prototype.shoot = function(person) {
    var diffX = Math.abs(this.x - person.x);
    var diffY = Math.abs(this.y - person.y);
    var distance = Math.pow((diffX * diffX + diffY * diffY), 0.5);
    if(distance < bulletRange) {
        return true;
    }
    else {
        return false;
    }
}