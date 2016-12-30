
/**
 * 游戏操作类
 * @Param {Object} background 游戏背景对象
 * @Param {Object} people 游戏人设对象
 * @Param {Object} imageFactory 预加载的照片
 * @Param {int} guardNum 守卫的数量
 */

function Game(canvas, peopleCanvas, imageFactory, guardNum) {
    this.canvas = canvas;
    this.peopleCanvas = peopleCanvas;
    this.imageFactory = imageFactory;
    this.guardNum = guardNum;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.peopleCanvas.width = canvasWidth;
    this.peopleCanvas.height = canvasHeight;

    this.context = this.peopleCanvas.getContext('2d');
    this.background = new Background(this.canvas, this.imageFactory);
    this.people = new PeopleAndTarget(this.context, this.imageFactory, 30, 30);
    this.guard = [];
    
    this.bulletPool = new BulletPool(this.context);
    this.bulletAnimate();
}

/**
 * 初始化函数
 */
Game.prototype.init = function() {
    this.background.start(this.guardNum);
    this.people.init(0, 0);
    this.bulletPool.init();
    for(var i = 0; i < map.rows; i++) {
        for(var j = 0; j < map.columns; j++) {
            if(map.arr[i][j] == 3) {
                var guard = new Guard(this.context, this.imageFactory, i * map.ceilWidth, j * map.ceilHeight, 30, 30);
                this.guard.push(guard);
            }
        }
    }
    this.animate();
    document.getElementById('score').innerHTML = 0;
    this.people.score = 0;
    document.getElementById('people').style.top = '0';
    document.getElementById('background').style.top = '0';
}

/**
 * 重新加载函数
 */
Game.prototype.restart = function() {
    this.people.route = false;
    this.people.routeArray = [];
    keyStatus['left'] = false;
    keyStatus['right'] = false;
    keyStatus['bottom'] = false;
    keyStatus['top'] = false;
    this.guard = [];
    this.bulletPool.pool.forEach(function(item) {
        if(item.inUse) {
            clearTimeout(item.timer);
            item.clear();
        }
    });
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.init();
}

/**
 * 动态调用people的move函数
 */
Game.prototype.animate = function() {
    var self = this;
    this.people.move();
    this.guard.forEach(function(item) {
        item.rotating();
        if(item.shoot(self.people)) {
            self.bulletPool.use();
            //console.log(item.rotate);
            self.bulletPool.get('blue', item.x + 15, item.y + 15, item.rotate % 360);
        }
    });
    if(this.meet()) {
        this.guardNum += 1;
        // this.level += 1;
        this.restart();
    }
    else if(this.collision(this.people, this.guard)) {
        this.restart();
    }
    else {
        this.timer = setTimeout(function() {
            self.animate();
        }, 1000 / 60);
    }
}

/**
 * 判断人和宝物是否重合的函数
 */

Game.prototype.meet = function() {
    var targetX = (map.rows - 2) * map.ceilWidth;
    var targetY = (map.columns - 2) * map.ceilHeight;

    return this.people.x > targetX - this.people.width &&
           this.people.x < targetX + this.people.width &&
           this.people.y > targetY - this.people.height &&
           this.people.y < targetY + this.people.height;
}

/**
 * item和array数组中任意一项碰撞，返回true
 * @Param {Object} item
 * @Param {Array[Object]} array
 */
Game.prototype.collision = function(item, array) {
    for(var i in array) {
        if(item.x > array[i].x - item.width &&
           item.x < array[i].x + item.width &&
           item.y > array[i].y - item.height &&
           item.y < array[i].y + item.height) {
            return i;
        }
    }
    return false;
}

/**
 * 判断人物子弹是否击中守卫
 */
Game.prototype.bulletAnimate = function() {
    var self = this;
    this.bulletPool.pool.forEach(function(item) {
        if(item.inUse && item.color == 'green') {
            for(var i = 0; i < self.guard.length; i++) {
                if(item.x > self.guard[i].x &&
                   item.x < self.guard[i].x + self.guard[i].width &&
                   item.y > self.guard[i].y &&
                   item.y < self.guard[i].y + self.guard[i].height) {
                    self.guard[i].deleteGuard();
                    self.guard.splice(i, 1);
                    clearTimeout(item.timer);
                    item.clear();
                    break;
                }
            }
        }
        else if(item.inUse && item.color == 'blue') {
            if(item.x > self.people.x &&
               item.x < self.people.x + self.people.width &&
               item.y > self.people.y &&
               item.y < self.people.y + self.people.height) {
                clearTimeout(item.timer);
                item.clear();
                clearTimeout(self.timer);
                self.restart();
            }
        }
    });
    setTimeout(function() {
        self.bulletAnimate();
    }, 1000 / 60);
}