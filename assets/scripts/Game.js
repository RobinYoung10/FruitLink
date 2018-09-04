var LinkSearch = require('LinkSearch');
var Game = cc.Class({
    extends: cc.Component,

    properties: {
        //表格节点
        grid: {
            default: null,
            type: cc.Node
        },
        //连接线段节点
        graphics: {
            default: null,
            type: cc.Node
        },
        //分数文字
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        alertLabel: {
            default: null,
            type: cc.Label
        },
        //游戏失败文字
        gameoverLabel: {
            default: null,
            type: cc.Label
        },
        //时间条
        progressBar: {
            default: null,
            type: cc.Node
        },
        //游戏结束音效
        gameoverAudio: {
            default: null,
            type: cc.AudioClip
        },
        //鼓掌音效
        applauseAudio: {
            default: null,
            type: cc.AudioClip
        },
        //play按钮
        playButton: {
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
        cc.debug.setDisplayStats(false);
        //获取格子节点宽高
        this.gridWidth = this.grid.width;
        this.gridHeight = this.grid.height;
        //格子的x轴和y轴数量
        this.gridXNum = 7;
        this.gridYNum = 10;
        //初始化分数
        this.score = 0;
        //初始化进度条衰减速度
        this.progressSpeed = 0.02;
        this.gameoverLabel.string = "";
        this.enabled = false;
    },

    onStartGame: function() {
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
        //储存剩余节点数
        this.itemNumber = 0;
        //调用两个初始化函数
        this.initItems();
        this.initItemArray();
        this.gameoverLabel.string = "";
        this.playButton.active = false;
        //使节点可用
        this.enabled = true;
    },

    //初始化70个item实例，循环35次，每次生成两个相同类型的item
    initItems: function() {
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
            //剩余节点数+1
            this.itemNumber++;
        }
        console.log(this.itemNumber);
    },

    //把88个item实例排列进二维数组itemList，并为每一个item设置位置
    initItemArray: function() {
        for(var i = 0; i < this.gridXNum; i++) {
            for(var j = 0; j < this.gridYNum; j++) {
                //while循环的意义在于如果随机数获取到的initItemList[index]已经被使用了需要重新获取
                while(true) {
                    //随机获取一个initItemList里面的item
                    var index = Math.floor(Math.random()*70);
                    if(this.initItemList[index] == 0) {
                        continue;
                    } else {
                        var item = this.initItemList[index];
                        //将item储存进ItemList
                        this.itemList[i][j] = item;
                        item.getComponent('Item').xAxis = i;
                        item.getComponent('Item').yAxis = j;
                        //设置item在grid的位置
                        item.setPosition(this.getNewItemPosition(i, j, this.gridWidth, this.gridHeight));
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
        //x轴，取7个格子里（单数/14）的点来定位item
        var randX = this.grid.x + (i * 2 * 1 / 14 + 1 / 14) * width;
        //y轴，取10个格子里（单数/20）的点来定位item
        var randY = this.grid.y + (j * 2 * 1 / 20 + 1 / 20) * height;

        return cc.v2(randX, randY);
    },

    //判断格子是否为空
    isEmpty: function(x, y) {
        return this.itemList[x][y] == 0 ? true : false;
    },

    //消除格子里的内容
    setEmpty: function(x, y) {
        this.itemList[x][y].getComponent('Item').playSuccessAudio();
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
                if(pointList) {
                    //添加选中的两个item进pointList，用于创造连线和计算得分
                    pointList.unshift(this.selectedItem[0]);
                    pointList.push(item);
                    //绘制连线
                    this.createLinkLine(pointList);
                    //根据pointList判断得分
                    if(pointList.length == 4) {
                        this.getScore(10);
                    } else {
                        if(pointList[1] != 1) {
                            this.getScore(5);
                        } else {
                            this.getScore(2);
                        }
                    }
                    //如果连通则消除两个格子里的item
                    this.setEmpty(item.xAxis, item.yAxis);
                    this.setEmpty(this.selectedItem[0].xAxis, this.selectedItem[0].yAxis);
                    flag = false;
                    //剩余item组数-1
                    this.itemNumber-=1;
                    //重置进度条
                    this.progressBar.children[0].width = this.progressBar.width;
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

    //消除item时创造连接线段
    createLinkLine: function(args) {
        //pos用于存放Vec2对象
        var pos = new Array();
        //获取路径所有点的位置
        for(var i = 0; i < args.length; i++) {
            var itemPos = this.getNewItemPosition(args[i].xAxis, args[i].yAxis, this.gridWidth, this.gridHeight);
            pos.push(itemPos);
        }
        //获取绘图组件
        var graphics = this.graphics.getComponent(cc.Graphics);
        //定义开始位置
        graphics.moveTo(pos[0].x, pos[0].y);
        //设置路径上的所有位置
        for(var j = 1; j < pos.length; j++) {
            if(pos[j].x != 0 && pos[j].y != 0) {
                graphics.lineTo(pos[j].x, pos[j].y);
            }
        }
        //绘制已定义的路径
        graphics.stroke();
        //定时0.5秒后清除路径，重复0次
        graphics.schedule(function() {
            graphics.clear();
        }, 0.3, 0);
    },

    //得分函数
    getScore: function(num) {
        this.score += num;
        this.scoreLabel.string = "Score : " + this.score;
        switch(num) {
            case 2:
                this.alertLabel.string = "+2";
                break;
            case 5:
                this.alertLabel.string = "Good! +5";
                break;
            case 10: 
                this.alertLabel.string = "Nice! +10";
                break;
            case 0:
                this.alertLabel.string = "GOOD_JOB";
        }
        var alert = this.alertLabel.getComponent(cc.Label);
        alert.schedule(function() {
            alert.string = "";
        }, 0.3, 0);
    },

    start () {
    },

    update: function(dt) {
        var progressContent = this.progressBar.children[0].width;
        var progressBlock = this.progressBar.width;
        if(progressContent >= 0) {
            this.progressBar.children[0].width -= 180 * this.progressSpeed;
            if(this.itemNumber == 0) {
                cc.audioEngine.playEffect(this.applauseAudio, false);
                this.getScore(0);
                this.onStartGame();
            }
        } else {
            this.progressSpeed += 0.02;
            this.progressBar.children[0].width = progressBlock;
            this.gameOver();
        }
    },

    //游戏失败
    gameOver: function() {
        this.enabled = false;
        for(var i = 0; i < this.gridXNum; i++) {
            for(var j = 0; j < this.gridYNum; j++) {
                if(this.itemList[i][j] != 0) {
                    this.itemList[i][j].destroy();
                    this.itemList[i][j] = 0;
                    cc.audioEngine.playEffect(this.gameoverAudio, false);
                }
            }
        }
        this.playButton.active = true;
        this.score = 0;
        this.progressSpeed = 0.02;
        this.gameoverLabel.string = "Game Over";
    }
});
