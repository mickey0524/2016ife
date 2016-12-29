  
/**
 *图片工厂，对图片做预加载
 */
function ImageFactory() {
    this.loadNum = 5;
    this.nowNum = 0;
    this.background = new Image();
    this.people = new Image();
    this.obstacle = new Image();
    this.target = new Image();
    this.guard = new Image();
    this.background.src = "img/bg.png";
    this.people.src = 'img/people.png';
    this.obstacle.src = 'img/obstacle.png';
    this.target.src = 'img/target.png';
    this.guard.src = 'img/guard.png';
    var self = this;
    this.background.onload = function() {
        self.imageLoad();
    }
    this.people.onload = function() {
        self.imageLoad();
    }
    this.obstacle.onload = function() {
        self.imageLoad();
    }
    this.target.onload = function() {
        self.imageLoad();
    }
    this.guard.onload = function() {
        self.imageLoad();
    }
}

/**
 *每一张照片加载，当前加载照片数目+1
 */

ImageFactory.prototype.imageLoad = function() {
    this.nowNum += 1;
}

/**
 *返回图片是否预加载完毕
 */

ImageFactory.prototype.returnLoadNum = function() {
    return (this.nowNum == this.loadNum) ? true : false;
}
