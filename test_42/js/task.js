
/**根据传来的年和月份生产对应的日历
 *@Param(year) : 年份
 *@Param(month) : 月份
 *@Retur : Null
 **/
function generate_calendar(year, month) {
	isChoose = -1;
	$('.month')[0].selectedIndex = month;
	var yearList = $('.year')[0].getElementsByTagName('option');
	for(var i = 0; i < yearList.length; i++) {
		if(yearList[i].innerHTML == year) {
			$('.year')[0].selectedIndex = i;
			break;
		}
	}	

	var calendar = $('.main_body');
	calendar.empty();
	var date = new Date();
	date.setFullYear(year);
	date.setMonth(month);
	date.setDate(1);

	var whatDay = date.getUTCDay();
	var monthDays = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
	for(var i = 0; i < whatDay; i++) {
		calendar.append($('<div></div>'));
	}
	for(var i = 0; i < monthDays; i++) {
		calendar.append($("<div class='day'>" + (i + 1) + "</div>"));
	}
}

/**将月份与日子的前面的0去掉
 *@Param(data) : 传上来的日期
 *@Return : 返回更改模式后的日期
 **/
function change_mode(data, mode) {
	if(mode == 0) {
		if(data.slice(0, 1) == '0') {
			return data.substring(1);
		}
	}

	else {
		if(String(data).length == 1) {
			data = '0' + data;
			return data;
		}
	}
	return data;
}

/**增加的备用接口，用于当用户选择日期后的回调处理
**/
function dealDate() {

}

/**点击日历框中的年和月
 **/
$('.year, .month').change(function() {
	generate_calendar($('.year').val(), $('.month')[0].selectedIndex); 
	$('.icon input').val('');
});

/**点击日历框中的向左按钮
 **/
$('.fa-reply').click(function() {
	var year = $('.year').val();
	var month = $('.month')[0].selectedIndex;
	if(month == 0) {
		year = Number(year) - 1;
	}
	else {
		month -= 1;
	}
	generate_calendar(year, month);
});

/**点击日历框中的向右按钮
 **/
$('.fa-share').click(function() {
	var year = $('.year').val();
	var month = $('.month')[0].selectedIndex;
	if(month == 11) {
		year = Number(year) + 1;
	}
	else {
		month += 1;
	}
	generate_calendar(year, month);
});

/**在输入框中制定日期，在日历的对应位置选中;
 **/
$('.icon input').change(function() {
	var date = $(this).val().split('-');
	date[1] = change_mode(date[1], 0);
	date[2] = change_mode(date[2], 0);
	generate_calendar(date[0], Number(date[1]) - 1);
	$('.main_body').children('.day').css({'background' : '#E4DEDE'});
	$('.main_body').children('.day').eq(Number(date[2]) - 1).css({'background' : '#fff'});
});

 /**点击日历框中的元素，显示在上方input框中
  **/
$('.main_body').on('click', 'div', function() {
	var year = $('.year').val();
	var month = $('.month')[0].selectedIndex + 1;
	var day = $('.day').index(this) + 1;
	month = change_mode(month, 1);
	day = change_mode(day, 1);
	var value = year + '-' + month + '-' + day;
	$('.icon input').val(value);
	if(workMode == 1) {
		$('.main_body').children('.day').css({'background' : '#E4DEDE'});
		$(this).css({'background' : '#fff'});	
	}
	else {
		if(isChoose != -1) {
			$('.main_body').children('.day').css({'background' : '#E4DEDE'});
			var max = Math.max(day - 1, isChoose);
			var min = Math.min(day - 1, isChoose);
			if((max - min) > max_num || (max - min) < min_num) {
				alert('您选择的时间区间大于规定的值，请重新设置!');
			}
			for(var i = min; i <= max; i++) {
				$('.main_body').children('.day').eq(i).css({'background' : '#fff'});	
			}
		}
		else {
			$(this).css({'background' : '#fff'});
		}
		isChoose = $('.day').index(this);
	}
	if(workMode == 1) {
		$('.calendar').hide(500);
	}
	
	dealDate();
});

/**点击日历上方按钮或者时间框，显示/隐藏日历组件
 **/
$('.icon i').click(function() {
	$('.calendar').toggle(500);
});

/**点击单天模式做的一些操作
 **/
$('.fa-calendar-o').click(function() {
	$('.max_min').hide(500);
	workMode = 1;
	if(isChoose != -1) {
		$('.main_body').children('.day').css({'background' : '#E4DEDE'});
		$('.main_body').children('.day').eq(isChoose).css('background', '#FFF');
	}
});

/**点击一段时间模式做的一些操作
 **/
$('.fa-calendar-plus-o').click(function() {
	$('.max_min').show(500);
	workMode = 2;
	$('.max_min').children('input').eq(0).val(min_num);
	$('.max_min').children('input').eq(1).val(max_num);
});

var max_num = 30, min_num = 0; 

/**设置一段时间模式的时间范围的最小值
 **/
$('.max_min').children('button').eq(0).click(function() {
	if($(this).prev().val() >= max_num || $(this).prev().val() < 0) {
		alert('你输入的数据有误!');
		$(this).prev().val(min_num);
	}
	else {
		min_num = $(this).prev().val();
	}	
});

/**设置一段时间模式的时间范围的最大值
 **/
$('.max_min').children('button').eq(1).click(function() {
	if($(this).prev().val() > 30 || $(this).prev().val() <= min_num) {
		alert('您输入的数据有误!');
		$(this).prev().val(max_num);
	}
	else {
		max_num = $(this).prev().val();
	}
});

var workMode = 1;  //判断现在工作在什么模式下
var isChoose = -1;  //判断在一段时间工作模式下是否已经选择过一个日期

window.onload = function() {
	var date = new Date();
	// $('.month')[0].selectedIndex = date.getUTCMonth();
	var month = date.getUTCMonth();
	var year = date.getUTCFullYear();
	generate_calendar(year, month);
}