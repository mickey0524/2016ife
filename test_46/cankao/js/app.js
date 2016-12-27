/**
 * Created by wangtingdong on 16/4/27.
 */

var game = new Game();

function init() {
    if(game.init()) {
        game.start();
    }
}

//图片仓库，方便调用图片
var imageRepository = new function() {
    this.background = new Image();
    this.people=new Image();
    this.obstacle=new Image();
    this.target=new Image();
    var numImages = 4;
    var numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.init();
        }
    }

    this.background.onload=function(){
        imageLoaded();
    };
    this.people.onload=function(){
        imageLoaded();
    };
    this.obstacle.onload=function(){
        imageLoaded();
    };
    this.target.onload=function(){
        imageLoaded();
    };

    this.background.src = "img/bg.png";
    this.people.src='img/people.png';
    this.obstacle.src='img/obstacle.png';
    this.target.src='img/target.png';
};

//抽象类，需要在地图中画的对象
function Drawable() {
    this.init = function(x, y,width,height) {
        this.x = x;
        this.y = y;
        this.width=width;
        this.height=height;
    };

    this.speed = 0;
    this.canvasWidth = CANVAS_WIDTH;
    this.canvasHeight = CANVAS_HEIGHT;

    this.draw = function() {
    };
}

//背景，障碍物和空地的绘制
function Background() {
    var status={
        NULL:0,     //空地值
        OBSTACLE:1  //障碍物值
    };

    function initMap(){
        MAP.arr=[];
        for(var i=0;i<MAP.rows;i++) {
            var arr=[];
            for(var j=0;j<MAP.cols;j++) {
                arr[j]=status.NULL;
            }
            MAP.arr[i]=arr;
        }
    }

    //随机一段路，保证目标是能达到的
    function randomRoad(){
        var x=0, y= 0;
        while (x!=MAP.rows-2 || y != MAP.cols-2) {
            MAP.arr[x][y]=2;
            if (y!=MAP.cols-2 && Math.random() > 0.7) {
                y++;
            }
            else {
                if ((x < MAP.rows-2 && Math.random() > 0.5) || x == 0) {
                    x++;
                }
                else {
                    x--;
                }
            }
        }
        MAP.arr[x][y]=2;
    }

    //随机创建障碍物
    function createObstacle(num) {
        for (var i = 0; i < num; i++) {
            var x = parseInt(Math.random(i) * MAP.rows),
                y = parseInt(Math.random(i) * MAP.cols);

            if (MAP.arr[x][y] != 0) {
                i--;
            }
            else {
                MAP.arr[x][y] = status.OBSTACLE;
            }
        }
    }

    //根据地图的数组画出空地和障碍物
    this.draw = function() {
        initMap();
        randomRoad();
        createObstacle(MAP.rows*MAP.cols/2);
        for(var i=0;i<MAP.rows;i++) {
            for(var j=0;j<MAP.cols;j++) {
                if(MAP.arr[i][j]==1) {
                    this.context.drawImage(imageRepository.obstacle,this.x+i*this.width, this.y+j*this.height,this.width,this.height);
                }
                else {
                    this.context.drawImage(imageRepository.background, this.x+i*this.width, this.y+j*this.height,this.width,this.height);
                }
            }
        }

    };
}
Background.prototype = new Drawable();

//移动的对象
function People(){
    this.rotation=0;        //旋转的角度
    this.speed=1;           //速度
    this.isRoute=false;     //是否是按路线移动
    this.routeMoveArr=[];   //存储路线的数组
    this.draw=function(){
        var angleInRadians=this.rotation*Math.PI/180;
        this.context.save();
        this.context.translate(this.x+this.width/2,this.y+this.height/2);
        this.context.rotate(angleInRadians);
        this.context.drawImage(imageRepository.people,-this.width/2,-this.height/2,this.width,this.height);
        this.context.restore();
    };

    //判断移动的方向有没有障碍物
    function isObstacle(x,y,width,height){
        var left_x=parseInt(x/MAP.cell_width),
            top_y=parseInt(y/MAP.cell_height),
            right_x=parseInt((x+width)/MAP.cell_width),
            bottom_y=parseInt((y+height)/MAP.cell_height);

        return MAP.arr[left_x][top_y]==1 || MAP.arr[left_x][bottom_y]==1 || MAP.arr[right_x][top_y]==1 || MAP.arr[right_x][bottom_y]==1;

    }
    this.move = function() {
        if (this.isRoute) {
            this.routeChange();
        }
        if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up) {
            var angleInRadians=this.rotation*Math.PI/180;
            this.context.save();
            this.context.translate(this.x+this.width/2,this.y+this.height/2);
            this.context.rotate(angleInRadians);
            this.context.clearRect(-this.width/2,-this.height/2,this.width,this.height);
            this.context.restore();
            if(KEY_STATUS.left && KEY_STATUS.top) {

            }
            else if (KEY_STATUS.left) {
                this.x -= this.speed;
                this.rotation = 180;
                if (this.x <= 0) {
                    this.x = 0;
                }
                else if (isObstacle(this.x, this.y, this.width, this.height)) {
                    this.x += this.speed;
                }

            } else if (KEY_STATUS.right) {
                this.rotation = 0;
                this.x += this.speed;
                if (this.x >= this.canvasWidth - this.width) {
                    this.x -= this.speed;
                }
                else if (isObstacle(this.x, this.y, this.width, this.height)) {
                    this.x -= this.speed;
                }

            }
            if (KEY_STATUS.up) {
                this.rotation = 270;
                this.y -= this.speed;
                if (this.y <= 0) {
                    this.y = 0;
                }
                else if (isObstacle(this.x, this.y, this.width, this.height)) {
                    this.y += this.speed;
                }

            } else if (KEY_STATUS.down) {
                this.rotation = 90;
                this.y += this.speed;
                if (this.y >= this.canvasHeight - this.height)
                    this.y -= this.speed;
                else if (isObstacle(this.x, this.y, this.width, this.height)) {
                    this.y -= this.speed;
                }

            }

            if(KEY_STATUS.left && KEY_STATUS.up) {
                this.rotation=225;
            }
            else if(KEY_STATUS.left && KEY_STATUS.down) {
                this.rotation=135;
            }
            else if(KEY_STATUS.right && KEY_STATUS.up) {
                this.rotation=315;
            }
            else if(KEY_STATUS.right && KEY_STATUS.down) {
                this.rotation=45;
            }
        }
        this.draw();
    };
    this.routeChange=function() {
        //重新设置移动的方向
        KEY_STATUS['left'] = false;
        KEY_STATUS['right'] = false;
        KEY_STATUS['up'] = false;
        KEY_STATUS['down'] = false;

        if(this.routeMoveArr.length==0) {
            this.isRoute=false;
            return;
        }

        var currentRoute = this.routeMoveArr[0];

        if(this.x==currentRoute.x*MAP.cell_width && this.y==currentRoute.y*MAP.cell_height) {
            this.routeMoveArr.shift();
            if(this.routeMoveArr.length==0) {
                this.isRoute=false;
                return;
            }
            currentRoute = this.routeMoveArr[0];
        }

        if (this.x > currentRoute.x*MAP.cell_width) {
            KEY_STATUS['left'] = true;
        }
        else if (this.x < currentRoute.x*MAP.cell_width) {
            KEY_STATUS['right'] = true;
        }
        else {
            KEY_STATUS['left'] = false;
            KEY_STATUS['right'] = false;
        }
        if (this.y > currentRoute.y*MAP.cell_height) {
            KEY_STATUS['up'] = true;
        }
        else if (this.y < currentRoute.y*MAP.cell_width) {
            KEY_STATUS['down'] = true;
        }
        else {
            KEY_STATUS['down'] = false;
            KEY_STATUS['up'] = false;
        }
    }
}
People.prototype=new Drawable();

//要到达的目标
function Target(){
    this.draw=function(){
        this.context.drawImage(imageRepository.target,this.x,this.y,this.width,this.height);
    }
}
Target.prototype=new Drawable();

function Game() {
    this.init = function() {
        this.bgCanvas = document.getElementById('background');
        this.peopleCanvas=document.getElementById('people');

        this.bgCanvas.width=CANVAS_WIDTH;
        this.bgCanvas.height=CANVAS_HEIGHT;
        this.peopleCanvas.width=CANVAS_WIDTH;
        this.peopleCanvas.height=CANVAS_HEIGHT;

        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.peopleContext=this.peopleCanvas.getContext('2d');

            Background.prototype.context = this.bgContext;
            People.prototype.context=this.peopleContext;
            Target.prototype.context=this.peopleContext;

            this.background = new Background();
            this.background.init(0,0,MAP.cell_width,MAP.cell_height);

            this.people=new People();
            this.people.init(0,0,30,30);

            this.target=new Target();
            this.target.init((MAP.rows-2)*MAP.cell_width,(MAP.cols-2)*MAP.cell_height,30,30);
            return true;
        } else {
            return false;
        }
    };

    this.start = function() {
        this.background.draw();
        this.people.draw();
        game.target.draw();
        animate();
    };
    this.restart=function(){
        this.people.init(0,0,30,30);
        this.people.routeMoveArr=[];
        this.peopleContext.clearRect(0,0,this.people.canvasWidth,this.people.canvasHeight);
        this.start();
    }
}

function animate() {
    game.people.move();
    if(detectCollision(game.people,game.target)){
        game.restart();
    }
    else {
        requestAnimFrame( animate );
    }

}

function detectCollision(obj1,obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

document.onkeydown = function(e) {

    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
    else if(keyCode == 27) {
        game.people.isRoute = false;
        game.people.routeMoveArr = [];
        KEY_STATUS['left'] = false;
        KEY_STATUS['right'] = false;
        KEY_STATUS['top'] = false;
        KEY_STATUS['down'] = false;
    }
};
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};
document.onclick=function(e){
    var end_x= parseInt(e.pageX/MAP.cell_width),
        end_y= parseInt(e.pageY/MAP.cell_height),
        start_x=parseInt(game.people.x/MAP.cell_width),
        start_y=parseInt(game.people.y/MAP.cell_height);
    var route=searchRoad(start_x,start_y,end_x,end_y,MAP.arr);
    game.people.isRoute=true;
    game.people.routeMoveArr=route;
};