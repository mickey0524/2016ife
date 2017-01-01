
var imageFactory = new ImageFactory();
var canvas = document.getElementById('background');
var peopleCanvas = document.getElementById('people');
var game = new Game(canvas, peopleCanvas, imageFactory, 6);


/**
 * 当图片资源加载完毕后，开始运行游戏
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
 * 相应上下左右按键，自动寻路过程中，点击Esc退出自动寻路
 * 寻路过程中点Esc退出寻路
 * 按空格键任务可以发出子弹
 * 如果任务有炸弹的话，按Ctrl可以使用炸弹，杀死全屏的敌人
 */
document.onkeydown = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if(keyCodes[keyCode]) {
        e.preventDefault();
        keyStatus[keyCodes[keyCode]] = true;
    }
    else if(keyCode == 27) {
        e.preventDefault();
        if(game.people.route) {
            game.people.route = false;
            game.people.routeArray = [];
            keyStatus['left'] = false;
            keyStatus['right'] = false;
            keyStatus['top'] = false;
            keyStatus['bottom'] = false;                
        }
        else {
            var audio = document.getElementById('backgroundAudio');
            if(audio.paused) {
                audio.play();
            }
            else {
                audio.pause();
            }
        }
    }
    else if(keyCode == 32) {
        e.preventDefault();
        game.bulletPool.use();
        game.bulletPool.get('green', game.people.x + 15, game.people.y + 15, game.people.rotateAngle);
    }
    else if(keyCode == 17) {
        e.preventDefault();
        game.useBomb();
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
 * 点击屏幕，触发自动寻路，按Esc可以退出自动寻路
 */
document.onclick = function(e) {
    if(e.pageY >= 30) {
        var top = document.getElementById('background').style.top;
        top = Math.abs(Number(top.slice(0, top.indexOf('p'))));
        var endX = parseInt(e.pageX / map.ceilWidth);
        var endY = parseInt((e.pageY - 30 + top) / map.ceilHeight);
        game.people.routeArray = findRoad(parseInt(game.people.x / map.ceilWidth), parseInt(game.people.y / map.ceilHeight), endX, endY);
        game.people.route = true;        
    } 
}



