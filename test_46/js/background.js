
/**
 *创建地图背景
 *@Param {Element} element canvas元素
 *@Param {Object} imageFactory 预加载的图片资源
 */
function Background(element, imageFactory) {
    this.canvas = element;
    this.context = this.canvas.getContext('2d');
    this.imageFactory = imageFactory;
}

Background.prototype.start = function() {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.initMap();
    this.randomRoad();
    this.makeObstacle(map.columns * map.rows / 2);
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
 *画图
 */
Background.prototype.draw = function() {
    // var context = this.canvas.getContext('2d');
    for(var i = 0; i < map.rows; i++) {
        for(var j = 0; j < map.columns; j++) {
            if(map.arr[i][j] == 1) {
                // console.log(imageRepository.obstacle);
                this.context.drawImage(this.imageFactory.obstacle, i * map.ceilWidth, j * map.ceilHeight, map.ceilWidth, map.ceilHeight);
            }
            else {
                this.context.drawImage(this.imageFactory.background, i * map.ceilWidth, j * map.ceilHeight, map.ceilWidth, map.ceilHeight);
            }
        }
    }
}