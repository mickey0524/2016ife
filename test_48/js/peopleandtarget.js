
/**
 *初始化人物和目标
 *@Param {ELement} element 人物的canvas
 *@Param {Object} imageFactory 预加载的图片资源
 *@Param {int} width 人物和宝物的宽度
 *@Param {int} height 人物和宝物的高度
 *@Param {int} x 人物的x轴坐标
 *@Param {int} y 人物的y轴坐标
 */
function PeopleAndTarget(element, imageFactory, width, height) {
    // this.canvas = element;
    this.context = element;
    this.imageFactory = imageFactory;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.route = false;
    this.routeArray = [];
    this.rotateAngle = 0;
    this.score = 0;
}

/**
 *初始化，把图像画到屏幕上
 *@Param {int} x，y 初始人物的位置
 */

PeopleAndTarget.prototype.init = function(x, y) {
    while(map.arr[x][y] == 1) {
        y += 1;
    }
    this.x = x * map.ceilWidth;
    this.y = y * map.ceilHeight;

    this.context.drawImage(this.imageFactory.people, this.x, this.y, this.width, this.height);
   // this.context.drawImage(this.imageFactory.target, (map.rows - 2) * map.ceilWidth, (map.columns - 2) * map.ceilWidth, this.width, this.height);
}

/**
 *任务移动，重新渲染人物
 */

PeopleAndTarget.prototype.draw = function() {
    var rotateArc = this.rotateAngle * Math.PI / 180;
    this.context.save();
    this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    this.context.rotate(rotateArc);
    this.context.drawImage(this.imageFactory.people, -this.width / 2, -this.height / 2, this.width, this.height);
    this.context.restore(); 
}

/**
 *判断前进方向是否有障碍
 *@Param {int} x,y 人物的坐标
 */
PeopleAndTarget.prototype.isObstacle = function(x, y) {
    var leftX = parseInt(x / map.ceilWidth);
    var rightX = parseInt((x + this.width) / map.ceilWidth);
    var topY = parseInt(y / map.ceilHeight);
    var bottomY = parseInt((y + this.height) / map.ceilHeight);

    return map.arr[leftX][topY] == 1 || map.arr[leftX][bottomY] == 1 || map.arr[rightX][topY] == 1 || map.arr[rightX][bottomY] == 1;
}

/**
 *人物移动
 */
PeopleAndTarget.prototype.move = function() {
    if(this.route) {
        this.routeChange();
    }

    if(keyStatus.left || keyStatus.right || keyStatus.top || keyStatus.bottom) {
        var rotateArc = this.rotateAngle * Math.PI / 180;
        this.context.save();
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.context.rotate(rotateArc);
        this.context.clearRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.context.restore();
        if(keyStatus.left) {
            this.x -= this.speed;
            if(this.x <= 0 || this.isObstacle(this.x, this.y)) {
                this.x += this.speed;
            }
            this.rotateAngle = 180;
        }
        else if(keyStatus.right) {
            this.x += this.speed;
            if(this.x >= canvasWidth - this.width || this.isObstacle(this.x, this.y)) {
                this.x -= this.speed;
            }
            this.rotateAngle = 0;
        }
        if(keyStatus.top) {
            this.y -= this.speed;
            this.score -= this.speed;
            if(this.y <= 0 || this.isObstacle(this.x, this.y)) {
                this.y += this.speed;
                this.score += this.speed;
            }
            this.rotateAngle = 270;
        }
        else if(keyStatus.bottom) {
            this.y += this.speed;
            this.score += this.speed;
            if(this.y >= canvasHeight - this.height || this.isObstacle(this.x, this.y)) {
                this.y -= this.speed;
                this.score -= this.speed;
            }
            this.rotateAngle = 90;
        }
        if(keyStatus['left'] && keyStatus['top']) {
            this.rotateAngle = 225;
        }
        else if(keyStatus['left'] && keyStatus['bottom']) {
            this.rotateAngle = 135;
        }
        else if(keyStatus['right'] && keyStatus['top']) {
            this.rotateAngle = 315;
        }
        else if(keyStatus['right'] && keyStatus['bottom']) {
            this.rotateAngle = 45;
        }
        document.getElementById('score').innerHTML = this.score;
        this.draw();
    }

}

/**
 *自动寻路实现
 */
PeopleAndTarget.prototype.routeChange = function() {
    keyStatus['left'] = false;
    keyStatus['right'] = false;
    keyStatus['bottom'] = false;
    keyStatus['top'] = false;
    if(this.routeArray.length == 0) {
        this.route = false;
        return ;
    }

    var currentRoute = this.routeArray[0];

    if(this.x == currentRoute.x * map.ceilWidth && this.y == currentRoute.y * map.ceilHeight) {
        this.routeArray.shift();
        if(this.routeArray.length == 0) {
            this.route = false;
            return ;
        }
        currentRoute = this.routeArray[0];
    }

    if(this.x < currentRoute.x * map.ceilWidth) {
        keyStatus['right'] = true;
    }
    else if(this.x > currentRoute.x * map.ceilWidth) {
        keyStatus['left'] = true;
    }
    else {
        keyStatus['left'] = false;
        keyStatus['right'] = false;
    }
    if(this.y > currentRoute.y * map.ceilHeight) {
        keyStatus['top'] = true;
    }
    else if(this.y < currentRoute.y * map.ceilHeight) {
        keyStatus['bottom'] = true;
    }
    else {
        keyStatus['top'] = false;
        keyStatus['bottom'] = false;
    }
}

