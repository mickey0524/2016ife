
var imageFactory = new ImageFactory();
var canvas = document.getElementById('background');
var peopleCanvas = document.getElementById('people');
var game = new Game(canvas, peopleCanvas, imageFactory);

var timer = setInterval(function() {
    if(imageFactory.returnLoadNum()) {
        clearInterval(timer);
        window.init();
    }
}, 100);

function init() {
    game.init();
}

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

