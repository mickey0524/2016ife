
/*
 * 模拟守卫的操作
 * @Param {context(2d)} context 相应canvas的画布
 * @Param {Object} imageFactory 预加载的图片库
 * @Param {int} x 守卫的x轴位置
 * @Param {int} y 守卫的y轴位置
 * @Param {int} width 守卫的宽度
 * @Param {int} height 守卫的高度
 * @Param {int} type 守卫的类型，0代表开枪守卫，1代表近战守卫
 * @Param {Array(Object)} path 守卫巡逻的路径 
 * @Param {String} direction 守卫巡逻的方向 南北向/东西向
 * @Param {int} rotate 守卫初始行进的方向
 */ 

function Guard(context, imageFactory, x, y, width, height, type, path, direction, rotate) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.imageFactory = imageFactory;
    this.route = false;
    this.routeArray = [];
    this.path = path;
    this.speed = 1;
    this.going = false;   //判断近战坦克是否在追击
    this.shooting = false;  //判断远战坦克是否在开枪
    this.direction = direction;
    this.rotate = rotate;
    this.init();
}

/** 
 * 初始化将守卫显示在屏幕上
 */
Guard.prototype.init = function() {
    if(this.type == 0) {
        this.context.drawImage(this.imageFactory.guard, this.x, this.y, this.width, this.height);
    }
    else {
        this.context.drawImage(this.imageFactory.guard1, this.x, this.y, this.width, this.height);
    }
}

/**
 * 模拟守卫的操作，有可能是旋转，也可能是追击
 */
Guard.prototype.operate = function() {
    if(this.route) {
        if(!this.going) {
            this.move();
        } 
    }

    else {
        this.context.save();
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.context.rotate(this.rotate * Math.PI / 180);
        this.context.clearRect(-20, -20, 40, 40);
        this.context.restore();
        if(this.shooting) {
            this.rotate += 3;
        }
        else {
            var point = this.path[0];
            if(this.direction == 'southToNorth') {
                if(this.y == point.y * map.ceilHeight) {
                    this.path.push(this.path.shift());
                }
                else if(this.y > point.y * map.ceilHeight) {
                    this.y -= this.speed;
                    this.rotate = 270;
                }
                else {
                    this.y += this.speed;
                    this.rotate = 90;
                }
            }
            else {
                if(this.x == point.x * map.ceilWidth) {
                    this.path.push(this.path.shift());
                }
                else if(this.x > point.x * map.ceilWidth) {
                    this.x -= this.speed;
                    this.rotate = 180;
                }
                else {
                    this.x += this.speed;
                    this.rotate = 0;
                }
            }         
        }
        this.draw(); 
    }
}

Guard.prototype.draw = function() {
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(this.rotate * Math.PI / 180);        
    if(this.type == 0) {
        this.context.drawImage(this.imageFactory.guard, -this.width / 2, -this.height / 2, this.width, this.height);
    }
    else {
        this.context.drawImage(this.imageFactory.guard1, -this.width / 2, -this.height / 2, this.width, this.height);
    }
    this.context.restore();
}

/**
 * 当游戏重新开始的时候，删除上一局的守卫
 */
Guard.prototype.deleteGuard = function() {
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(this.rotate * Math.PI / 180);
    this.context.clearRect(-20, -20, 40, 40);
    this.context.restore();
    if(this.type == 1 && this.going) {
        clearInterval(this.timer);
    }
}

/**
 * 判断人物是否进入守卫射程之内
 * @Param {Object} person 守卫需要判断敌人是否进入自己的射程
 */
Guard.prototype.scope = function(person) {
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


/**
 * 当玩家进入近战守卫的感知范围，近战守卫自动追逐
 */
Guard.prototype.move = function() {
    this.going = true;
    var nextPoint = this.routeArray.shift();
    //console.log(nextPoint);
    var left = false, right = false, top = false, bottom = false, num = 0;
    var self = this;

    this.timer = setInterval(function() {
        self.context.save();
        self.context.translate(self.x + self.width / 2, self.y + self.height / 2);
        self.context.rotate(self.rotate);
        self.context.clearRect(-20, -20, 40, 40);
        self.context.restore();
        if(self.x < nextPoint.x * map.ceilWidth) {
            right = true;
            self.rotate = 0;
            self.x += self.speed;
        }
        else if(self.x > nextPoint.x * map.ceilWidth) {
            left = true;
            self.rotate = 180;
            self.x -= self.speed;
        }
        if(self.y > nextPoint.y * map.ceilHeight) {
            top = true;
            self.rotate = 270;
            self.y -= self.speed;
        }
        else if(self.y < nextPoint.y * map.ceilHeight) {
            bottom = true;
            self.rotate = 90;
            self.y += self.speed;
        }   
        if(left && top) {
            self.rotate = 225;
        }
        else if(left && bottom) {
            self.rotate = 135;
        }
        else if(right && top) {
            self.rotate = 315;
        }
        else if(right && bottom) {
            self.rotate = 45;
        }
        self.context.save();
        self.context.translate(self.x + self.width / 2, self.y + self.height / 2);
        self.context.rotate(self.rotate * Math.PI / 180);
        self.context.drawImage(self.imageFactory.guard1, -self.width / 2, -self.height / 2, self.width, self.height);
        self.context.restore();
        num += 1;
        if(num == 34) {
            self.going = false;
            clearInterval(self.timer);
        }
    }, 1000 / 60);
}