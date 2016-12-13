var aqiData = {};

var $ = function(id) {
	return document.getElementById(id);
}

function addAqiData() {
	var city = $("aqi-city-input").value;
	var quality = $("aqi-value-input").value;
	if(!city.match(/^[a-zA-Z\u4E00-\u9FA5]+$/)) {
		alert("城市名字必须为中英文字符");
		return ;
	}
	if(!quality.match(/^[0-9]+$/)) {
		alert("空气质量指数必须为整数!");
		return ;
	}
	aqiData[city] = quality;
}

function renderAqiList() {
	var tables = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	for(var c in aqiData) {
		tables += "<tr><td>" + c + "</td><td>" + aqiData[c] + "</td><td><button>删除</button></td></tr>"
	}
	$("aqi-table").innerHTML = c ? tables : "";
}

function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

function delBtnHandle(obj) {
	var tr = obj.parentNode.parentNode;
	$("aqi-table").firstChild.removeChild(tr);
	delete aqiData[tr.firstChild.innerHTML];
	renderAqiList();
}

function init() {
	$("add-btn").onclick = addBtnHandle;
	$("aqi-table").addEventListener("click", function(e) {
		console.log(e);
		console.log(e.target);
		if (e.target && e.target.nodeName == "BUTTON") {
			delBtnHandle(e.target);
		}
	});
}

init()