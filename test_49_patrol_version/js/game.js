
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
    this.bomb = [];

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
                var type = parseInt(Math.random() * 2);
                // var type = 0;
                var percent = Math.random();
                var direction = (percent >= 0.5) ? 'southToNorth' : 'eastToWest';
                var path = [];
                percent = Math.random();
                var rotate;
                if(percent >= 0.5) {
                    rotate = (direction == 'southToNorth') ? 90 : 0;
                }
                else {
                    rotate = (direction == 'southToNorth') ? 270 : 180;
                }
                if(direction == 'southToNorth') {
                    var south, north;
                    for(north = j; north >= 0 && map.arr[i][north] != 1; north--) {}
                    for(south = j; south < map.columns && map.arr[i][south] != 1; south++) {}
                    if(rotate == 90) {
                        for(var k = j + 1; k < south; k++) { path.push({x : i, y : k}); }
                        for(var k = south - 1; k > north; k--) { path.push({x : i, y : k}); }
                        for(var k = north + 1; k <= j; k++) { path.push({x : i, y : k}); }
                    }
                    else {
                        for(var k = j - 1; k > north; k--) { path.push({x : i, y : k}); }
                        for(var k = north + 1; k < south; k++) { path.push({x : i, y : k}); }
                        for(var k = south - 1; k >= j; k--) { path.push({x : i, y : k}); }
                    }
                }
                else {
                    var east, west;
                    for(east = i; east < map.rows && map.arr[east][j] != 1; east++) {}
                    for(west = i; west >= 0 && map.arr[west][j] != 1; west--) {}
                    if(rotate == 0) {
                        for(var k = i + 1; k < east; k++) { path.push({x : k, y : j}); }
                        for(var k = east - 1; k > west; k--) { path.push({x : k, y : j}); }
                        for(var k = west + 1; k <= i; k++ ) { path.push({x : k, y : j}); }
                    }
                    else {
                        for(var k = i - 1; k > west; k--) { path.push({x : k, y : j}); }
                        for(var k = west + 1; k < east; k++) { path.push({x : k, y : j}); }
                        for(var k = east - 1; k >= i; k--) { path.push({x : k, y : j}); }
                    }
                }
               // console.log(path);
                var guard = new Guard(this.context, this.imageFactory, i * map.ceilWidth, j * map.ceilHeight, 30, 30, type, path, direction, rotate);
                this.guard.push(guard);
            }
            else if(map.arr[i][j] == 4) {
                this.bomb.push({x : i * map.ceilWidth, y : j * map.ceilHeight, width : 30, height : 30});
                this.context.drawImage(this.imageFactory.bomb, i * map.ceilWidth, j * map.ceilHeight, 30, 30);
            }
        }
    }
    this.animate();
    document.getElementById('score').innerHTML = 0;
    this.people.score = 0;
    document.getElementById('people').style.top = '0';
    document.getElementById('background').style.top = '0';
    this.people.wreck = 0;
    document.getElementById('wreck').innerHTML = 0;
    document.getElementById('bombNum').innerHTML = '0';
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
        if(item.scope(self.people)) {
            if(item.type == 0) {
                item.shooting = true;  
                self.bulletPool.use();
                self.bulletPool.get('blue', item.x + 15, item.y + 15, item.rotate % 360); 
            }
            else {
                item.route = true;
                item.routeArray = findRoad(parseInt(item.x / map.ceilWidth), parseInt(item.y / map.ceilHeight), 
                                           parseInt(self.people.x / map.ceilWidth), parseInt(self.people.y / map.ceilHeight));
            }
        }
        else {
            if(item.route) {
                if(item.x == item.path[0].x * map.ceilWidth && item.y == item.path[0].y * map.ceilHeight) {
                    item.route = false;
                    item.routeArray = [];
                }
                else {
                    item.route = true;
                    item.routeArray = findRoad(parseInt(item.x / map.ceilWidth), parseInt(item.y / map.ceilHeight),
                                               item.path[0].x, item.path[0].y);
                }
            }
            else if(item.shooting) {
                item.shooting = false;
            }

        }
        item.operate();
    });
    var index;
    if((index = this.collision(this.people, this.bomb))) {
        this.context.clearRect(this.bomb[index].x, this.bomb[index].y, 34, 34);
        this.bomb.splice(index, 1);
        this.people.bomb += 1;
        document.getElementById('bombNum').innerHTML = this.people.bomb;
        document.getElementById('treasure').play();
    }
    if(this.meet()) {
        this.guardNum += 1;
        // this.level += 1;
        this.restart();
    }
    else if((index = this.collision(this.people, this.guard))) {
        if(this.guard[index].type == 1 && this.guard[index].going) {
            clearInterval(this.guard[index].timer);
        }
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
                    self.people.wreck += 1;
                    document.getElementById('wreck').innerHTML = self.people.wreck;
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

/**
 * 玩家使用炸弹，炸毁屏幕范围内所有敌人
 */
Game.prototype.useBomb = function() {
    if(this.people.bomb > 0) {
        this.people.bomb -= 1;
        var top = document.getElementById('background').style.top;
        top = Math.abs(Number(top.slice(0, top.indexOf('p'))));
        var bottom = top + document.documentElement.offsetHeight;
        for(var i = 0; i < this.guard.length; i++) {
             if(this.guard[i].y >= top && this.guard[i].y <= bottom) {
                this.guard[i].deleteGuard();
                this.guard.splice(i, 1);
                this.people.wreck += 1;
                i -= 1;
            }  
        }
        document.getElementById('wreck').innerHTML = this.people.wreck;
        document.getElementById('bombNum').innerHTML = this.people.bomb;  
        document.getElementById('bombAudio').play();     
    }
}