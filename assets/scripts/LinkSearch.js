
var LinkSearch = {

    properties: {
    },

    //0折连接函数
    matchZero: function(stcItem, destItem) {
        //如果两个item不再同一条直线上，返回false
        if(stcItem.xAxis != destItem.xAxis && stcItem.yAxis != destItem.yAxis) 
            return false;
        
        var min = -1, max = -1;

        //如果两点纵坐标相等，则横向扫描
        if(stcItem.yAxis == destItem.yAxis) {
            //分别去两个item的大小横坐标
            min = stcItem.xAxis < destItem.xAxis ? stcItem.xAxis : destItem.xAxis;
            max = stcItem.xAxis > destItem.xAxis ? stcItem.xAxis : destItem.xAxis;
            //判断两个item横坐标路径是否相通（从较小的那个item的下一个点开始扫描，并且如果是相邻的点则直接返回true)
            for(min++; min < max ; min++) {
                //如果路径上的item为空，则继续扫描下一个点
                if(this.isEmpty(min, stcItem.yAxis)) {
                    continue;
                } else {
                    return false;
                }
            }
        } else { //如果两个点横坐标相等，则纵向扫描
            min = stcItem.yAxis < destItem.yAxis ? stcItem.yAxis : destItem.yAxis;
            max = stcItem.yAxis > destItem.yAxis ? stcItem.yAxis : destItem.yAxis;
            for(min++; min < max ; min++) {
                if(this.isEmpty(stcItem.xAxis, min)) {
                    continue;
                } else {
                    return false;
                }
            }
        }
        return true;
    },

    //1折连接算法
    matchOne: function(stcItem, destItem) {
        //如果两个item在同一条直线上，返回false
        if(stcItem.xAxis == destItem.xAxis || stcItem.yAxis == destItem.yAxis) 
            return false;
        //对角点1
        var point = {};
        point.xAxis = stcItem.xAxis;
        point.yAxis = destItem.yAxis;
        //在对角点1判断是否与两个点都能0折连通，能连通则返回点的坐标
        if(this.isEmpty(point.xAxis, point.yAxis)) {
            var match1 = this.matchZero(stcItem, point);
            var match2 = match1 ? this.matchZero(point, destItem) : match1;
            if(match1 && match2) {
                return point;
            }
        }

        //对角点2
        var point = {};
        point.xAxis = destItem.xAxis;
        point.yAxis = stcItem.yAxis;
        //在对角点2判断是否与两个点都能0折连通，能连通则返回点的坐标
        if(this.isEmpty(point.xAxis, point.yAxis)) {
            var match1 = this.matchZero(stcItem, point);
            var match2 = match1 ? this.matchZero(point, destItem) : match1;
            if(match1 && match2) {
                return point;
            }
        }
        return false;
    },

    //2折连接函数
    matchTwo: function(stcItem, destItem, itemList) {
        //用于储存item的二维数组
        this.itemList = itemList;
        //判断是否能0折连通，能则返回数组[1]
        if(this.matchZero(stcItem, destItem)) {
            return [1];
        }
        //判断是否能1折连通，能则返回对角点坐标
        if(this.matchOne(stcItem, destItem)) {
            var point = this.matchOne(stcItem, destItem);
            return [point];
        }
        
        //从stcItem点的坐标依次 y轴向上、y轴向下、x轴向右、x轴向左 扫描有没有一个点能与 destItem 1折连通
        var i;
        for(i = stcItem.yAxis + 1; i < 10; i++) {
            if(this.isEmpty(stcItem.xAxis, i)) {
                var point1 = {};
                point1.xAxis = stcItem.xAxis;
                point1.yAxis = i;
                var point2 = this.matchOne(point1, destItem);
                if(point2) {
                    return [point1, point2];
                }
            } else {
                break;
            }
        }

        for(i = stcItem.yAxis - 1; i >= 0; i--) {
            if(this.isEmpty(stcItem.xAxis, i)) {
                var point1 = {};
                point1.xAxis = stcItem.xAxis;
                point1.yAxis = i;
                var point2 = this.matchOne(point1, destItem);
                if(point2) {
                    return [point1, point2];
                }
            } else {
                break;
            }
        }

        for(i = stcItem.xAxis + 1; i < 7; i++) {
            if(this.isEmpty(i, stcItem.yAxis)) {
                var point1 = {};
                point1.xAxis = i;
                point1.yAxis = stcItem.yAxis;
                var point2 = this.matchOne(point1, destItem);
                if(point2) {
                    return [point1, point2];
                }
            } else {
                break;
            }
        }

        for(i = stcItem.xAxis -1; i >= 0; i--) {
            if(this.isEmpty(i, stcItem.yAxis)) {
                var point1 = {};
                point1.xAxis = i;
                point1.yAxis = stcItem.yAxis;
                var point2 = this.matchOne(point1, destItem);
                if(point2) {
                    return [point1, point2];
                }
            } else {
                break;
            }
        }
        return false;
    },

    //判断格子是否为空
    isEmpty: function(x, y) {
        return this.itemList[x][y] == 0 ? true : false;
    },

    start () {

    },

    // update (dt) {},
};

module.exports = LinkSearch;
