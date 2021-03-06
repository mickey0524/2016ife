
/**
 *创建地图背景
 *@Param {Element} element canvas元素
 *@Param {Object} imageFactory 预加载的图片资源
 *@Param {int} guardNum 背景中的敌人个数
 */
function Background(element, imageFactory) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.imageFactory = imageFactory;
}

/**
 * 初始化函数
 * @Param {int} guardNum 当前关卡首位的个数，最多为18个
 */
Background.prototype.start = function(guardNum) {
    this.guardNum = (guardNum > 18) ? 18 : guardNum;
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.initMap();
    this.randomRoad();
    this.makeObstacle(map.columns * map.rows / 6);
    this.makeGuard();
    this.draw();
}

/**
 *清空地图上所有东西
 */

Background.prototype.initMap = function() {
    map.arr = [];
    for(var i = 0; i < map.rows; i++) {
        var arr = [];
        for(var j = 0; j < map.columns; j++) {
            arr[j] = 0;
        }
        map.arr.push(arr);
    }
}

/**
 *留出一条路来，不能设置障碍
 */

Background.prototype.randomRoad = function() {
    var i = 0, j = 0;
    while(i < (map.rows - 2) || j < (map.columns - 2)) {
        map.arr[i][j] = 2;
        if(j < (map.columns - 2) && Math.random() > 0.7) {
            j += 1;
        }
        else {
            if((i < (map.rows - 2) && Math.random()) > 0.5 || i == 0) {
                i += 1;
            }
            else {
                i -= 1;
            }
        }
    }
    map.arr[i][j] = 2;
}

/**
 *设置障碍
 */

Background.prototype.makeObstacle = function(num) {
    for(var i = 0; i < num; i++) {
        var x = parseInt(Math.random() * map.rows);
        var y = parseInt(Math.random() * map.columns);
        if(map.arr[x][y] != 0) {
            i -= 1;
        }
        else {
            map.arr[x][y] = 1;
        }
    }
}

/**
 * 设置守卫
 */
Background.prototype.makeGuard = function() {

    for(var i = 0; i < this.guardNum; i++) {
        var x = parseInt(Math.random() * map.rows);
        var y = parseInt(Math.random() * map.columns);
        if(map.arr[x][y] != 0 ||  x == map.rows - 1 || y == map.columns - 1) {
            i -= 1;
        }
        else {
            map.arr[x][y] = 3;
        }
    }
}

/**
 *画图
 */
Background.prototype.draw = function() {
    for(var i = 0; i < map.rows; i++) {
        for(var j = 0; j < map.columns; j++) {
            if(map.arr[i][j] == 1) {
                this.context.drawImage(this.imageFactory.obstacle, i * map.ceilWidth, j * map.ceilHeight, map.ceilWidth, map.ceilHeight);
            }
            else {
                this.context.drawImage(this.imageFactory.background, i * map.ceilWidth, j * map.ceilHeight, map.ceilWidth, map.ceilHeight);
            }
        }
    }
}