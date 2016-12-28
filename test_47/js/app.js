
var imageFactory = new ImageFactory();
var canvas = document.getElementById('background');
var peopleCanvas = document.getElementById('people');
var game = new Game(canvas, peopleCanvas, imageFactory, 6);


/**
 *当图片资源加载完毕后，开始运行游戏
 */
var timer = setInterval(function() {
    if(imageFactory.returnLoadNum()) {
        clearInterval(timer);
        window.init();
    }
}, 100);

function init() {
    game.init();
}

/**
 *相应上下左右按键，自动寻路过程中，点击Esc退出自动寻路
 */
document.onkeydown = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if(keyCodes[keyCode]) {
        e.preventDefault();
        keyStatus[keyCodes[keyCode]] = true;
    }
    else if(keyCode == 27) {
        game.people.route = false;
        game.people.routeArray = [];
        keyStatus['left'] = false;
        keyStatus['right'] = false;
        keyStatus['top'] = false;
        keyStatus['bottom'] = false;       
    }
    else if(keyCode == 32) {
        game.bulletPool.use();
        game.bulletPool.get('green', game.people.x + 15, game.people.y + 15, game.people.rotateAngle);
    }
}

document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if(keyCodes[keyCode]) {
        e.preventDefault();
        keyStatus[keyCodes[keyCode]] = false;
    }
}

/**
 *点击屏幕，触发自动寻路，按Esc可以退出自动寻路
 */
document.onclick = function(e) {
    var endX = parseInt(e.pageX / map.ceilWidth);
    var endY = parseInt(e.pageY / map.ceilHeight);
    game.people.routeArray = findRoad(parseInt(game.people.x / map.ceilWidth), parseInt(game.people.y / map.ceilHeight), endX, endY);
    game.people.route = true;
}



