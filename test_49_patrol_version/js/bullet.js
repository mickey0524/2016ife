
/*
 * 利用对象池技术创建子弹对象
 */

 function Bullet(context) {
    this.inUse = false;
    this.radius = 3;
    this.width = 3;       //为了复用碰撞函数
    this.height = 3;
    this.context = context;
    this.flyStatus = {
        left : false,
        right : false,
        top : false,
        bottom : false
    }

    /**
     * 初始化函数，设定子弹的不变量
     */
    this.init = function() {
        this.speed = 3;
        this.range = bulletRange;
    };

    /**
     * 调用一个不在使用的子弹对象进行初始化
     * @Param {String} color 子弹的颜色
     * @Param {int} (x,y) 子弹的坐标
     * @Param {int} angle 子弹的偏射角
     */
    this.spawn = function(color, x, y, angle) {
        if(angle % 45 == 0) {
            this.flyStatus.top = false;
            this.flyStatus.bottom = false;
            this.flyStatus.left = false;
            this.flyStatus.right = false;
            this.x = x;
            this.y = y;
            this.distance = 0;
            switch(angle) {
                case 0 : this.flyStatus.right = true; this.x += 17; break;
                case 90 : this.flyStatus.bottom = true; this.y += 17; break;
                case 180 : this.flyStatus.left = true; this.x -= 17; break;
                case 270 : this.flyStatus.top = true; this.y -= 17; break;
                case 45 : this.flyStatus.right = true; this.flyStatus.bottom = true; this.x += 17; this.y += 17; break;
                case 135 : this.flyStatus.bottom = true; this.flyStatus.left = true; this.x -= 17; this.y += 17; break;
                case 225 : this.flyStatus.left = true; this.flyStatus.top = true; this.x -= 17; this.y -= 17; break;
                case 315 : this.flyStatus.top = true; this.flyStatus.right = true; this.x += 17; this.y -= 17; break;
                default : break;
            }
            this.inUse = true;
            this.color = color;
            this.angle = angle;
            this.flying = true;
            this.fly();    
        }
    };

    /**
     * 判断已经用过的子弹对象是否能够重新使用
     */
    this.use = function() {
        if(!this.flying) {
            return true;
        }
        else {
            return false;
        }
    };
    
    /**
     * 当子弹对象使用完毕后，赋值false
     */
    this.clear = function() {
        this.inUse = false;
    };
    
    /**
     * 子弹飞行过程中的模拟量
     */
    this.fly = function() {
        this.context.save();
        this.context.translate(this.x + this.radius / 2, this.y + this.radius / 2);
        this.context.rotate(this.angle * Math.PI / 180);
        this.context.clearRect(-this.radius - 1, -this.radius - 1, 2 * this.radius + 2, 2 * this.radius + 2);
        this.context.restore();
        console.log(this.x + ' ' + this.y);
        if(this.flyStatus.left) {
            this.x -= this.speed;
        }
        else if(this.flyStatus.right) {
            this.x += this.speed;
        }
        if(this.flyStatus.top) {
            this.y -= this.speed;
        }
        else if(this.flyStatus.bottom) {
            this.y += this.speed;
        }
        this.distance += this.speed;
        var bullet_x = parseInt(this.x / map.ceilWidth);
        var bullet_y = parseInt(this.y / map.ceilHeight);
        bullet_x = (bullet_x >= 0) ? bullet_x : 0;
        bullet_y = (bullet_y >= 0) ? bullet_y : 0;
        bullet_x = (bullet_x < map.rows) ? bullet_x : (map.rows - 1);
        bullet_y = (bullet_y < map.columns) ? bullet_y : (map.columns - 1);
        if(map.arr[bullet_x][bullet_y] == 1) {
            this.clear();
            clearTimeout(this.timer);
        }
        else {
            if(this.distance < this.range) {
                this.context.save();
                this.context.translate(this.x + this.radius / 2, this.y + this.radius / 2);
                this.context.rotate(this.angle * Math.PI / 180);
                this.context.beginPath();
                this.context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
                this.context.closePath();
                this.context.fillStyle = this.color;
                this.context.fill();
                this.context.restore();
                var self = this;
                this.timer = setTimeout(function(){
                    self.fly();
                }, 1000 / 60);
            }
            else {
                this.clear();
                clearTimeout(this.timer);
            }
        }
    }
 }
 
 /**
  * 子弹的对象池
  */
 function BulletPool(context) {
    this.context = context;
    this.size = 30;
    this.pool = [];

    /**
     * 对象池初始化，限制为20个对象
     */
    this.init = function() {
        for(var i = 0; i < this.size; i++) {
            var bullet = new Bullet(this.context);
            bullet.init();
            this.pool[i] = bullet;
        }
    };

    /**
     * 获取一个可以使用的子弹对象
     */
    this.get = function(color, x, y, angle) {
        if(!this.pool[this.size - 1].inUse) {
            this.pool[this.size - 1].spawn(color, x, y, angle);
            document.getElementById('bulletAudio').play();
            this.pool.unshift(this.pool.pop());
        }
    };
    
    /**
     * 将使用完毕的子弹对象移到数组尾部，重新使用
     */
    this.use = function() {
        for(var i = 0; i < this.size; i++) {
            if(this.pool[i].inUse) {
                if(this.pool[i].use()) {
                    this.pool[i].clear();
                    this.pool.push((pool.splice(i, 1))[0]);
                }
            }
            else {
                break;
            }
        }
    }
 }