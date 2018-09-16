cc.Class({
    extends: cc.Component,

    properties: {
        //背景音乐
        roundAudio: {
            default: null,
            type: cc.AudioClip
        },
        display: cc.Sprite,
        closeRankButton: cc.Node
    },

    start () {
        this.roundNumber = cc.audioEngine.playEffect(this.roundAudio, true);
        this.tex = new cc.Texture2D();
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

    //返回首页
    back () {
        cc.audioEngine.stop(this.roundNumber);
        cc.director.loadScene("start");
    },

    update () {
        this._updaetSubDomainCanvas();
    }
});
