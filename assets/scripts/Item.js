cc.Class({
    extends: cc.Component,

    properties: {
        xAxis: 0,
        yAxis: 0,
        type: 0,
        //选中音效
        selectedAudio: {
            default: null,
            type: cc.AudioClip
        },
        //消除失败音效
        failAudio: {
            default: null,
            type: cc.AudioClip
        },
        //消除成功音效
        successAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    setTouched: function() {
        this.node.setScale(1.5, 1.5);
        var flag = this.game.setSelected(this);
        cc.audioEngine.playEffect(this.selectedAudio, false);
    },

    setToucheOff: function() {
        this.node.setScale(1.2, 1.2);
        cc.audioEngine.playEffect(this.failAudio, false);
    },

    playSuccessAudio: function() {
        cc.audioEngine.playEffect(this.successAudio, false);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.setTouched, this);
    },

    start () {

    },

    // update (dt) {},
});
