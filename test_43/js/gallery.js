/**
 *拼图布局
 *@Param (String) selector 相册的class
 *@Param ([]) photos 照片的url
 *@Constructor
 */

function Gallery(selector, photos) {
	this.photos = photos.slice(0, 6);  //最多放6张照片
	this.gallery = document.getElementsByClassName(selector)[0];
	this.init();
	this.setSizes();
}

Gallery.prototype.init = function() {
	this.gallery.innerHTML = this.photos.reduce(function(prev, cur) {
		prev += '<div class="gallery_item" style="background-image: url(' + cur + '); background-size: cover;"></div>'
		return prev;
	}, '');
}

Gallery.prototype.setSizes = function() {
	var items = document.getElementsByClassName('gallery_item');
	this['sizes' + this.photos.length]().forEach(function(size, i) {
		items[i].style.width = size.width + 'px';
		items[i].style.height = size.height + 'px';
		if(size.right) {
			items[i].style.float = 'right';
		}
		if(size.position) {
			items[i].style.position = 'absolute';
			items[i].style.left = size.left + 'px';
			items[i].style.top = size.top + 'px';
		}
	})
}

Gallery.prototype.sizes1 = function() {
	return [{
		width : this.gallery.clientWidth,
		height : this.gallery.clientHeight
	}];
}

Gallery.prototype.sizes2 = function() {
	var unit = this.gallery.offsetWidth / 2;
	return [
		{
			width : unit,
			height : this.gallery.offsetHeight
		},
		{
			width : unit,
			height : this.gallery.offsetHeight		
		}
	];
}

Gallery.prototype.sizes3 = function() {
	var width = this.gallery.clientWidth / 2;
	var height = this.gallery.clientHeight / 2;
	return [
		{
			width : width,
			height : this.gallery.clientHeight
		},
		{
			width : width,
			height : height,
			right : true
		},
		{
			width : width,
			height : height,
			position : true,
			left : width,
			top : height
		}
	];
}

Gallery.prototype.sizes4 = function() {
	var width = this.gallery.clientWidth / 2;
	var height = this.gallery.clientHeight / 2;
	return [
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		}
	];
}

Gallery.prototype.sizes5 = function() {
	var width = this.gallery.clientWidth / 3;
	var height = this.gallery.clientHeight / 3;
	return [
		{
			width : this.gallery.clientWidth - width,
			height : this.gallery.clientHeight - height
		},
		{
			width : width,
			height : height,
			right : true
		},
		{
			width : width,
			height : this.gallery.clientHeight - height,
			position : true,
			left : this.gallery.clientWidth - width,
			top : height
		},
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		}
	];
}

Gallery.prototype.sizes6 = function() {
	var width = this.gallery.offsetWidth / 3;
	var height = this.gallery.offsetHeight / 3;
	return [
		{
			width : width * 2,
			height : height * 2
		},
		{
			width : width,
			height : height,
			right : true
		},
		{
			width : width,
			height : height,
			position : true,
			left : width * 2,
			top : height
		},
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		},
		{
			width : width,
			height : height
		}
	];
}
