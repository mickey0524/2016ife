
document.getElementById('i').onclick = function() {
	document.getElementsByTagName('input')[0].click();
}

document.getElementsByTagName('input')[0].onchange = function() {
	var picArray = [];
	for(var i = 0; i < this.files.length; i++) {
		var name = this.files[i].name;
		picArray.push('./images/' + name);
	}
	var gallery = document.getElementsByClassName('gallery')[0];
	for(var i = 0; i < gallery.childNodes.length; i++) {
		gallery.removeChild(gallery.childNodes[i]);
	}
	gallery = new Gallery('gallery', picArray);
}