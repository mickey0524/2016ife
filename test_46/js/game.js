
/**
 *游戏操作类
 *@Param {Object} background 游戏背景对象
 *@Param {Object} people 游戏人设对象
 *@Param {Object} imageFactory 预加载的照片
 */

function Game(canvas, peopleCanvas, imageFactory) {
    this.canvas = canvas;
    this.peopleCanvas = peopleCanvas;
    this.imageFactory = imageFactory;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.peopleCanvas.width = canvasWidth;
    this.peopleCanvas.height = canvasHeight;

    this.background = new Background(this.canvas, this.imageFactory);
    this.people = new PeopleAndTarget(this.peopleCanvas, this.imageFactory, 30, 30);
}

/**
 *初始化函数
 */
Game.prototype.init = function() {
    this.background.start();
    this.people.init(0, 0);
    this.animate();
}

/**
 *重新加载函数
 */
Game.prototype.restart = function() {
    this.people.deletePeople();
    this.init();
}

/**
 *动态调用people的move函数
 */
Game.prototype.animate = function() {
    this.people.move();
    if(this.meet()) {
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
