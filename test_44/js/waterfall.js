
/**
 *瀑布布局
 *@Param {String} selector 选择符
 *@Param {Number} cols 布局列数，默认为4
 *@Param {Number} gap 布局列之间的间隙
 */

 function Waterfall(selector, cols, gap) {
 	this.cols = cols || 4;
 	this.gap = gap || 16;
 	this.element = document.getElementById(selector);
 	console.log(this.element.clientWidth);
 	this.colWidth = (this.element.clientWidth - (this.cols + 1) * this.gap - 20) / this.cols; //-20是因为当前demo相册的宽度就是屏幕的可是宽度，受到滚动条的影响
 	this.init();
 }

 Waterfall.prototype.init = function() {
 	this.element.style.marginLeft = this.gap + 'px';
 	this.element.style.marginTop = this.gap + 'px';	
 	for(var i = 0; i < this.cols; i++) {
 		var col = document.createElement('div');
 		col.className = 'waterfall-col';
 		col.style.width = this.colWidth + 'px';
 		col.style.marginRight = this.gap + 'px';
 		this.element.appendChild(col);
 	}
 	this.columns = this.element.getElementsByClassName('waterfall-col');
 }

 /**
  *@Param {Array} photos 相片
  */
 Waterfall.prototype.append = function(photos) {
 	photos.forEach((function(photo) {
 		var photoDiv = document.createElement('div');
 		var width = Math.min(this.colWidth, photo.width);
 		photoDiv.innerHTML = '<img src="' + photo.url + '" width="' + width + 'px" height="' + photo.height + 'px">';
 		photoDiv.style.marginBottom = this.gap + 'px';
 		photoDiv.style.display = 'inline-block';
 		this.getMinCol().appendChild(photoDiv);
 		photoDiv.onclick = this.modal;
 	}).bind(this));
 }

 /**
  *获得当前最短的列来放该照片
  */
 Waterfall.prototype.getMinCol = function() {
 	var min = this.columns[0];
 	for(var i = 1; i < this.columns.length; i++) {
 		if(this.columns[i].clientHeight < min.clientHeight) {
 			min = this.columns[i];
 		}
 	}

 	return min;
 }

 /**
  *当图片被点击，全屏显示
  */
 Waterfall.prototype.modal = function(e) {
 	var photoUrl = e.target.src;
 	var popupWindow = document.createElement('div');
 	popupWindow.className = 'modal';
 	popupWindow.style.width = document.documentElement.clientWidth + 'px';
 	popupWindow.style.height = document.documentElement.clientHeight + 'px';
 	document.getElementsByTagName('body')[0].insertBefore(popupWindow, this.element);	

 	var photoDiv = document.createElement('div');
 	var width = document.documentElement.clientWidth * 3 / 5;
 	photoDiv.innerHTML = '<img src="' + photoUrl + '" width="' + width + 'px" height="' + document.documentElement.clientHeight + 'px">';
 	photoDiv.className = 'modal-img';
 	popupWindow.appendChild(photoDiv);

 	popupWindow.onclick = function(e) {
 		if(e.pageX < photoDiv.offsetLeft || e.pageX > (photoDiv.offsetLeft + photoDiv.clientWidth)) {
 			popupWindow.parentNode.removeChild(popupWindow);
 		}
 	};
 }

