cc.Class({
    extends: cc.Component,

    properties: {
        xAxis: 0,
        yAxis: 0,
        type: 0,
    },

    setTouched: function() {
        this.node.setScale(1.5, 1.5);
        var flag = this.game.setSelected(this);
    },

    setToucheOff: function() {
        this.node.setScale(1, 1);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.setTouched, this);
    },

    start () {

    },

    // update (dt) {},
});
