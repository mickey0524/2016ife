
/**
 *木桶布局
 *@Param {String} selector 相册的选择符
 *@Param {int} minHeight 最小高度
 *@Param {int} gap 图片之间的间距
 */
function Bowie(selector, minHeight, gap) {
	this.element = document.getElementById(selector);
	this.minHeight = minHeight || 300;
	this.gap = gap || 8;
	this.minAspectRatio = this.element.clientWidth / this.minHeight;
	this.photo = [];
	this.init();
}

Bowie.prototype.init = function() {
	this.element.style.marginLeft = this.gap + 'px';
	this.element.style.marginTop = this.gap + 'px';
}

/**
 *@Params {Array} photos 图片数组
 */
Bowie.prototype.append = function(photos) {
	var self = this;

	this.getRows(photos).forEach(function(row) {
		var totalWidth = self.element.clientWidth - (row.photos.length) * self.gap;
		var _row = document.createElement('div');

		_row.className = 'gallery-row';
		_row.style.height = totalWidth / row.aspectRatio + 'px';
		_row.style.marginBottom = self.gap + 'px';
		var preWidth = 0;
		for(var i = 0; i < row.photos.length; i++) {
			var item = document.createElement('div');
			item.className = 'photo-item';
			item.style.marginRight = self.gap + 'px';
			if(i == row.photos.length - 1) {                             //当每一行最后一张相片溢出该行的时候，对其宽度进行一定修改来适应
				row.photos[i].width = self.element.clientWidth - (i + 2) * self.gap - preWidth - 10;
				console.log(row.photos[i].width);
			}
			preWidth += Number(row.photos[i].width);
			item.innerHTML = '<img src="' + row.photos[i].url + '" width="' + row.photos[i].width + 'px" height="' + _row.style.height + 'px">';
			_row.appendChild(item);
		}

		self.element.appendChild(_row);
	});
}


/**
 *@Params {Array} 图片数组
 *@Return {Array(Object)} 行数组
 */
Bowie.prototype.getRows = function(photos) {
	var aspectRatio = 0;
	var rows = [];
	var _photos = [];

	for(var i = 0; i < photos.length; i++) {
		_photos.push(photos[i]);
		aspectRatio += photos[i].width / photos[i].height;
		if(aspectRatio > this.minAspectRatio) {
			rows.push({
				aspectRatio : aspectRatio,
				photos : _photos
			});
			_photos = [];
			aspectRatio = 0;
		}
	}

	if(_photos.length != 0) {                   //目前暂时这样处理最后一行单独的照片，以后和服务端连上后，可以将这部分作为对象的属性this.photos保留下来，等下一次响应一起处理
		rows.push({
			aspectRatio : this.minAspectRatio,
			photos : _photos
		})
	}

	return rows;
}