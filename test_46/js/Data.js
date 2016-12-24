
var canvasWidth = document.getElementsByTagName('body')[0].offsetWidth;
var canvasHeight = document.getElementsByTagName('body')[0].offsetHeight;

var keyCodes = {
    37 : 'left',
    38 : 'top',
    39 : 'right',
    40 : 'bottom'
};

var keyStatus = {
    'left' : false,
    'right' : false,
    'top' : false,
    'bottom' : false
};

var map = {
    arr : [],
    width : canvasWidth,
    height : canvasHeight,
    ceilWidth : 34,
    ceilHeight : 34,
    rows : parseInt(canvasWidth / 34) + 1,
    columns : parseInt(canvasHeight / 34) + 1
};
