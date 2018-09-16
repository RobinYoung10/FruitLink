cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Node
        },
        //背景音乐
        roundAudio: {
            default: null,
            type: cc.AudioClip
        },
        //排行榜按钮
        rankButton: {
            default: null,
            type: cc.Node
        },
        //分享按钮
        shareButton: {
            default: null,
            type: cc.Node
        },
        //最高分文字
        highestLabel: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.roundNumber = cc.audioEngine.playEffect(this.roundAudio, true);
        this.rankButton.on(cc.Node.EventType.TOUCH_START, this.showRank, this);
        this.shareButton.on(cc.Node.EventType.TOUCH_START, this.shareFriend, this);
    },

    startGame: function() {
        cc.audioEngine.stop(this.roundNumber);
        cc.director.loadScene("game");
    },

    //排行榜按钮事件
    showRank: function() {
        //this.display.active = true;
        //this._isShow = !this._isShow;
        // 发消息给子域
       // wx.postMessage({
            //message: this._isShow ? 'Show' : 'Hide'
        //})
        cc.audioEngine.stop(this.roundNumber);
        cc.director.loadScene("rank");
    },

    //分享按钮
    shareFriend: function() {
        if(CC_WECHATGAME) {
            wx.shareAppMessage({
                title: "听说这是考验帅哥美女眼力的游戏！"
            })
        }
    },

    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
        if(!this._isShow) {
            this.display.active = false;
        }
    },

    start () {
        if(CC_WECHATGAME) {
            wx.login({
                //scope: scope.userInfo,
                success: (res) => {
                    wx.getUserInfo({
                        success: (res) => {
                            console.log(res);
                        }
                    })
                }
            })
        }
    },

    update () {
        //this._updaetSubDomainCanvas();
    }
});
