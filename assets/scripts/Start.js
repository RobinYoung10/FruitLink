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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.roundNumber = cc.audioEngine.playEffect(this.roundAudio, true);
    },

    startGame: function() {
        cc.audioEngine.stop(this.roundNumber);
        cc.director.loadScene("game");
    },

    start () {

    },

    // update (dt) {},
});
