
/**
 * 生成自动寻路的路径
 * @Param {int} (startX, startY) 自动寻路的起点坐标
 * @Param {int} (endX, endY) 自动寻路的终点坐标
 * @Return {Array} 自动寻路的路径
 */ 

function findRoad(startX, startY, endX, endY) {
    var openList = [];   //尝试访问的节点
    var closeList = [];  //关闭的节点
    var result = [];     //结果数组
    var result_index;    //终点在openList中的索引
    // console.log('1 ' + startX);
    // console.log('2 ' + startY);
    // console.log('3 ' + endX);
    // console.log('4 ' + endY);

    openList.push({
        x : startX,
        y : startY,
        G : 0
    });

    do {
        var curPoint = openList.pop();
        closeList.push(curPoint);      
        var pointList = surroundPoint(curPoint);
        for(var i in pointList) {
            var item = pointList[i];
            if(item.x >= 0 && item.x < map.rows && item.y >= 0 && item.y < map.columns &&
               map.arr[item.x][item.y] != 1 && !existList(item, closeList) && 
               map.arr[curPoint.x][item.y] != 1 && map.arr[item.x][curPoint.y] != 1) {
                    var g = curPoint.G + ((curPoint.x - item.x) * (curPoint.y - item.y) == 0 ? 10 : 14);
                    if(!existList(item, openList)) {
                        item.G = g;
                        item.H = Math.abs(endX - item.x) * 10 + Math.abs(endY - item.y) * 10;
                        item.F = item.G + item.H;
                        item.parent = curPoint;
                        openList.push(item);
                    }
                    else {
                        var index = existList(item, openList);
                        if(g < openList[index].G) {
                            openList[index].parent = curPoint;
                            openList[index].G = g;
                            openList[index].F = g + openList[index].H;
                        }
                    }
            }
        }
        if(openList.length == 0) {
            break;
        }
        openList.sort(function(item1, item2) {
            return item2.F - item1.F;
        });

    } while(!(result_index = existList({x : endX, y : endY}, openList)));

    if(result_index) {
        var point = openList[result_index];
        do {
            result.unshift({
                x : point.x,
                y : point.y
            });
            point = point.parent;
        } while(point.x != startX || point.y != startY);
    }
    return result;

}

/**
 * 返回当前被打开的点的周围八个点
 */
function surroundPoint(point) {
    var x = point.x;
    var y = point.y;
    return [
        {x : x - 1, y : y - 1},
        {x : x, y : y - 1},
        {x : x + 1, y : y - 1},
        {x : x + 1, y : y},
        {x : x + 1, y : y + 1},
        {x : x, y : y + 1},
        {x : x - 1, y : y + 1},
        {x : x - 1, y : y}
    ];
}


/**
 * 判断point是否存在于list中
 *
 */
function existList(point, list) {
    for(var i = 0; i < list.length; i++) {
        if(list[i].x == point.x && list[i].y == point.y) {
            return i;
        }
    }
    return false;
}