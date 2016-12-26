
var imageFactory = new ImageFactory();
var canvas = document.getElementById('background');
var peopleCanvas = document.getElementById('people');
var game = new Game(canvas, peopleCanvas, imageFactory);


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
 *相应上下左右按键
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
    game.people.routeArray = findRoad(game.people.x, game.people.y, endX, endY);
    game.people.route = true;
}

