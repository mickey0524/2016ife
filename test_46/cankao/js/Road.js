/**
 * Created by wangtingdong on 16/4/26.
 */


function searchRoad(start_x,start_y,end_x,end_y,map){
    var openList=[],    //开启列表
        closeList=[],   //关闭列表
        result=[],      //结果数组
        result_index;   //结果数组在开启列表中的序号

    openList.push({x:start_x,y:start_y,G:0});

    do{
        var currentPoint = openList.pop();
        closeList.push(currentPoint);
        var surroundPoint=SurroundPoint(currentPoint);
        for(var i in surroundPoint) {
            var item = surroundPoint[i];                //获得周围的八个点
            if (
                item.x>=0 &&                            //判断是否在地图上
                item.y>=0 &&
                item.x<MAP.rows &&
                item.y<MAP.cols &&
                MAP.arr[item.x][item.y] != 1 &&         //判断是否是障碍物
                !existList(item, closeList) &&          //判断是否在关闭列表中
                MAP.arr[item.x][currentPoint.y]!=1 &&   //判断之间是否有障碍物，
                MAP.arr[currentPoint.x][item.y]!=1) {
                //g 到起点的位置
                var g = currentPoint.G + ((currentPoint.x - item.x) * (currentPoint.y - item.y) == 0 ? 10 : 14);
                if (!existList(item, openList)) {       //如果不在开启列表中
                    item['H'] = Math.abs(end_x - item.x) * 10 + Math.abs(end_y - item.y) * 10;
                    item['G'] = g;
                    item['F'] = item.H + item.G;
                    item['parent'] = currentPoint;
                    openList.push(item);
                }
                else {                                  //存在在开启列表中，比较目前的g值和之前的g的大小
                    var index = existList(item, openList);
                    if (g < openList[index].G) {
                        openList[index].parent = currentPoint;
                        openList[index].G = g;
                        openList[index].F=g+openList[index].H;
                    }

                }
            }
        }
        //如果开启列表空了，没有通路，结果为空
        if(openList.length==0) {
            break;
        }
        openList.sort(sortF);
    }while(!(result_index=existList({x:end_x,y:end_y},openList)));


    if(!result_index) {
        result=[];
    }
    else {
        var currentObj=openList[result_index];
        do{
            result.unshift({
                x:currentObj.x,
                y:currentObj.y
            });
            currentObj=currentObj.parent;
        }while (currentObj.x!=start_x || currentObj.y!=start_y);

    }
    console.log(result);
    return result;

}
//用F值对数组排序
function sortF(a,b){
    return b.F- a.F;
}
//获取周围八个点的值
function SurroundPoint(curPoint){
    var x=curPoint.x,y=curPoint.y;
    return [
        {x:x-1,y:y-1},
        {x:x,y:y-1},
        {x:x+1,y:y-1},
        {x:x+1,y:y},
        {x:x+1,y:y+1},
        {x:x,y:y+1},
        {x:x-1,y:y+1},
        {x:x-1,y:y}
    ]
}
//判断点是否存在在列表中
function existList(point,list) {
    for(var i in list) {
        if(point.x==list[i].x && point.y==list[i].y) {
            return i;
        }
    }
    return false;
}