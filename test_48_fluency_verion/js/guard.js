
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
        var guardX = parseInt(this.x / map.ceilWidth);
        var guardY = parseInt(this.y / map.ceilHeight);
        var personX = parseInt(person.x / map.ceilWidth);
        var personY = parseInt(person.y / map.ceilHeight);
        var maxX, maxY, minX, minY;
        if(guardX == personX) {
            maxX = guardX;
            minX = guardX;
        }
        else {
            maxX = Math.max(guardX, personX) - 1;
            minX = Math.min(guardX, personX);
        }
        if(personY == guardY) {
            minY = guardY;
            maxY = guardY;
        }
        else {
            maxY = Math.max(guardY, personY) - 1;
            minY = Math.min(guardY, personY);
        }
        //console.log(minX + ' ' + maxX + ' ' + minY + ' ' + maxY);
        for(var i = minX; i <= maxX; i++) {
            for(var j = minY; j <= maxY; j++) {
                if(map.arr[i][j] == 1) {
                    return false;
                }
            }
        }
        return true;
    }
    else {
        return false;
    }
}