
/**
 *游戏操作类
 *@Param {Object} background 游戏背景对象
 *@Param {Object} people 游戏人设对象
 *@Param {Object} imageFactory 预加载的照片
 *@Param {int} guardNum 守卫的数量
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
}

/**
 *初始化函数
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
}

/**
 *重新加载函数
 */
Game.prototype.restart = function() {
    this.people.route = false;
    this.people.routeArray = [];
    keyStatus['left'] = false;
    keyStatus['right'] = false;
    keyStatus['bottom'] = false;
    keyStatus['top'] = false;
    this.people.deletePeople();
    this.guard.forEach(function(item) {
        item.deleteGuard();
    });
    this.guard = [];
    this.init();
}

/**
 *动态调用people的move函数
 */
Game.prototype.animate = function() {
    this.people.move();
    this.guard.forEach(function(item) {
        item.rotating();
    });
    if(this.meet()) {
        this.guardNum += 1;
        this.restart();
    }
    else if(this.collision()) {
        this.restart();
    }
    else {
        var self = this;
        setTimeout(function() {
            self.animate();
        }, 1000 / 60);
    }
}

/**
 *判断人和宝物是否重合的函数
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
 * 人如果和守卫相撞，提示任务已经gg
 */
Game.prototype.collision = function() {
    for(var i in this.guard) {
        if(this.people.x > this.guard[i].x - this.people.width &&
           this.people.x < this.guard[i].x + this.people.width &&
           this.people.y > this.guard[i].y - this.people.height &&
           this.people.y < this.guard[i].y + this.people.height) {
            return true;
        }
    }
    return false;
}
