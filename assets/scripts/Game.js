var LinkSearch = require('LinkSearch');
var Game = cc.Class({
    extends: cc.Component,

    properties: {
        //表格节点
        grid: {
            default: null,
            type: cc.Node
        },
        //水果1
        item1: {
            default: null,
            type: cc.Prefab
        },
        //水果2
        item2: {
            default: null,
            type: cc.Prefab
        },
        //水果3
        item3: {
            default: null,
            type: cc.Prefab
        },
        //水果4
        item4: {
            default: null,
            type: cc.Prefab
        },
        //水果5
        item5: {
            default: null,
            type: cc.Prefab
        },
        //水果6
        item6: {
            default: null,
            type: cc.Prefab
        },
        //水果7
        item7: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        var gridWidth = this.grid.width;
        var gridHeight = this.grid.height;
        //格子的x轴和y轴数量
        this.gridXNum = 8;
        this.gridYNum = 11;
        //储存选中的item
        this.selectedItem = new Array();
        //声明二维数组实例，用来储存之后的item实例
        this.itemList = [
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0],];
        //initItemList用于临时存放初始化的item
        this.initItemList = new Array();
        //初始化88个item实例，循环44次，每次生成两个相同类型的item
        for(var i = 0; i < this.gridXNum * this.gridYNum / 2; i++) {
            //获得1~7的一个随机数
            var num = Math.floor(Math.random()*7+1);
            //获得一个新的item实例
            var newItem = this.initItem(num);
            //将item添加进game
            newItem.parent = this.node;
            //在item组件上暂存Game对象引用
            newItem.getComponent('Item').game = this;
            //将item储存进initItemList
            this.initItemList.push(newItem);
            //从newItem克隆一个相同类型的item,同样做跟之前相同的操作
            var newItem2 = cc.instantiate(newItem);
            newItem2.parent = this.node;
            newItem2.getComponent('Item').game = this;
            this.initItemList.push(newItem2);
        }
        //把88个item实例排列进二维数组itemList，并为每一个item设置位置
        for(var i = 0; i < this.gridXNum; i++) {
            for(var j = 0; j < this.gridYNum; j++) {
                //while循环的意义在于如果随机数获取到的initItemList[index]已经被使用了需要重新获取
                while(true) {
                    //随机获取一个initItemList里面的item
                    var index = Math.floor(Math.random()*88);
                    if(this.initItemList[index] == 0) {
                        continue;
                    } else {
                        var item = this.initItemList[index];
                        //将item储存进ItemList
                        this.itemList[i][j] = item;
                        item.getComponent('Item').xAxis = i;
                        item.getComponent('Item').yAxis = j;
                        //设置item在grid的位置
                        item.setPosition(this.getNewItemPosition(i, j, gridWidth, gridHeight));
                        //将initItemList的index位置设置为0
                        this.initItemList[index] = 0;
                        break;
                    }
                }
            }
        }
    },

    //初始化item函数
    //根据参数num，选择要生成的item
    initItem: function(num) {
        var newItem = null;
        switch(num) {
            case 1:
                newItem = cc.instantiate(this.item1);
                break;
            case 2:
                newItem = cc.instantiate(this.item2);
                break;
            case 3:
                newItem = cc.instantiate(this.item3);
                break;
            case 4:
                newItem = cc.instantiate(this.item4);
                break;
            case 5:
                newItem = cc.instantiate(this.item5);
                break;
            case 6:
                newItem = cc.instantiate(this.item6);
                break;
            case 7:
                newItem = cc.instantiate(this.item7);
                break;
        }
        return newItem;
    },

    //获取item位置函数
    //通过传入的参数: i=>x轴, j=>y轴, 来设置宽高值
    getNewItemPosition: function(i, j, width, height) {
        //x轴，取8个格子里（单数/16）的点来定位item
        var randX = this.grid.x + (i * 2 * 1 / 16 + 1 / 16) * width;
        //y轴，取11个格子里（单数/22）的点来定位item
        var randY = this.grid.y + (j * 2 * 1 / 22 + 1 / 22) * height;

        return cc.v2(randX, randY);
    },

    //判断格子是否为空
    isEmpty: function(x, y) {
        return this.itemList[x][y] == 0 ? true : false;
    },

    //消除格子里的内容
    setEmpty: function(x, y) {
        this.itemList[x][y].destroy();
        this.itemList[x][y] = 0;
    },
    
    //选中item后触发事件
    setSelected: function(item) {
        //获取已经被选中的item
        var num = this.selectedItem.length;
        //立个flag
        var flag = true;
        //如果当前没有已选中item，则push选中的item
        if(num == 0) {
            this.selectedItem.push(item);
        } else if(num == 1) {
            //如果选中的两个item类型相同，并且两次选择的item不相同，则做连通判断
            if(item.type == this.selectedItem[0].type && item != this.selectedItem[0]) {
                //连通判断
                var pointList = LinkSearch.matchTwo(this.selectedItem[0], item, this.itemList);
                console.log(pointList);
                if(pointList) {
                    //如果连通则消除两个格子里的item
                    this.setEmpty(item.xAxis, item.yAxis);
                    this.setEmpty(this.selectedItem[0].xAxis, this.selectedItem[0].yAxis);
                    flag = false;
                }
            }
            //如果没被消除，将item大小设置回原本大小
            if(flag) {
                item.setToucheOff();
                this.selectedItem[0].setToucheOff();
            }
            //无论有没有被消除，都要执行出栈操作，以保证下一次选取的正常
            this.selectedItem.pop();
        }
    },

    start () {
        
    },

    // update (dt) {},
});
