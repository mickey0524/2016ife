/**获得元素
 @param Element.id
 @return ELement
 **/
function $(id) {
	return document.getElementById(id);
}

/**点击蒙层关闭按钮或者蒙层外部关闭蒙层
**/
$('mask').onclick = $('close-btn').onclick = function() {
	$('float').style.display = 'none';
	$('mask').style.display = 'none';
}

/**点击header栏登录按钮打开蒙层
**/
$('log_in').onclick = function() {
	$('float').style.display = 'block';
	$('mask').style.display = 'block';	
}


/**自动全屏
@param 想要全屏的元素
@return null
**/
function fillToBody(el) {
	var screen_width = document.documentElement.clientWidth;
	var screen_height = document.documentElement.clientHeight;
	//console.log(screen_width + ' ' + screen_height);
	//console.log(el);
	el.style.width = screen_width + 'px';
	el.style.height = screen_height + 'px';
	//console.log(el.width + ' ' + el.height);
}

function autoCenter(el) {
	el.style.left = (document.documentElement.clientWidth - el.offsetWidth) / 2 + 'px';
	el.style.top = (document.documentElement.clientHeight - el.offsetHeight) / 2 + 'px';
}

var mouseOffsetX = 0;
var mouseOffsetY = 0;
var isDrag = false;

$('head').addEventListener('mousedown', function(e){
	var e = e || window.event;   //兼容IE
	isDrag = true;
	mouseOffsetX = e.pageX - $('float').offsetLeft;
	mouseOffsetY = e.pageY - $('float').offsetTop;
});

document.onmousemove = function(e) {
	var e = e || window.event;
	mouseX = e.pageX;
	mouseY = e.pageY;

	var moveX = 0;
	var moveY = 0;

	if(isDrag) {
		moveX = mouseX - mouseOffsetX;
		moveY = mouseY - mouseOffsetY;

		var maxMoveX = document.documentElement.clientWidth - $('float').offsetWidth;
		var maxMoveY = document.documentElement.clientHeight - $('float').offsetHeight;

		$('float').style.left = Math.min(maxMoveX, Math.max(0, moveX)) + 'px';
		$('float').style.top = Math.min(maxMoveY, Math.max(0, moveY)) + 'px';
	}
}

var mouseStartX = 0, mouseStartY = 0, moving = 0;
var mousePanel, mouseCtrl, mouseType;

/**当三个扩展边框被按下时
 @Param(e):事件
 @Param(panel):蒙层
 @Param(ctrl):被按下的扩展边框按键
 @Param(type):按下相应的扩展边框按键触发的对应的事件
 **/
function onMouseDown(e, panel, ctrl, type) {
	var e = e || window.event;

	mouseStartX = e.pageX - ctrl.offsetLeft;
	mouseStartY = e.pageY - ctrl.offsetTop;

	mousePanel = panel;
	mouseCtrl = ctrl;
	mouseType = type;

	moving = setInterval(move, 10);
}

function move() {
	if(moving) {
	//	console.log(mos + ' ' + mouseY);
		var toX = mouseX - mouseStartX;
		var toY = mouseY - mouseStartY;

		var maxWidth = document.documentElement.clientWidth - mousePanel.offsetLeft - 10;
		var maxHeight = document.documentElement.clientHeight - mousePanel.offsetTop - 10;

		toX = Math.min(maxWidth, Math.max(300, toX));
		toY = Math.min(maxHeight, Math.max(200, toY));

		switch(mouseType) {
			case 'r' : mousePanel.style.width = toX + 'px';
					   // mouseCtrl.style.left = toX + 'px';
					   break;
			case 'b' : mousePanel.style.height = toY + 'px';
			           // mouseCtrl.style.top = toY + 'px';
					   break;
			case 'rb' : mousePanel.style.width = toX + 'px'; 
						mousePanel.style.height = toY + 'px'; 
						// mouseCtrl.style.left = toX + 'px';
						// mouseCtrl.style.top = toY + 'px';
						break;
		}
	}
}

document.onmouseup = function(){
	isDrag = false;
	clearInterval(moving);
	moving = 0;
}

function resizing(el) {
	var rightBox = document.createElement('div');
	var bottomBox = document.createElement('div');
	var rightBottomBox = document.createElement('div');

	rightBox.className = 'resizeable-right';
	bottomBox.className = 'resizeable-bottom';
	rightBottomBox.className = 'resizeable-right-bottom';

	el.appendChild(rightBox);
	el.appendChild(bottomBox);
	el.appendChild(rightBottomBox);

	rightBox.addEventListener('mousedown', function(e) {
		onMouseDown(e, el, rightBox, 'r');
	});

	bottomBox.addEventListener('mousedown', function(e) {
		onMouseDown(e, el, bottomBox, 'b');
	});

	rightBottomBox.addEventListener('mousedown', function(e) {
		onMouseDown(e, el, rightBottomBox, 'rb');
	});
}

window.onload = window.onresize = function() {
	autoCenter($('float'));
	fillToBody($('mask'));
	resizing($('float'));
}