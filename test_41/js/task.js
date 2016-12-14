
/**根据传来的年和月份生产对应的日历
 *@Param(year) : 年份
 *@Param(month) : 月份
 *@Retur : Null
 **/
function generate_calendar(year, month) {
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
	$('input').val('');
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
$('input').change(function() {
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
	$('.main_body').children('.day').css({'background' : '#E4DEDE'});
	$(this).css({'background' : '#fff'});	
	var year = $('.year').val();
	var month = $('.month')[0].selectedIndex;
	var day = $('.day').index(this) + 1;
	month = change_mode(month, 1);
	day = change_mode(day, 1);
	var value = year + '-' + month + '-' + day;
	$('input').val(value);
	$('.calendar').hide(500);
	
	dealDate();
});

/**点击日历上方按钮或者时间框，显示/隐藏日历组件
 **/
$('.icon i').click(function() {
	$('.calendar').toggle(500);
});

window.onload = function() {
	var date = new Date();
	// $('.month')[0].selectedIndex = date.getUTCMonth();
	var month = date.getUTCMonth();
	var year = date.getUTCFullYear();
	generate_calendar(year, month);
}