cc.Class({
    extends: cc.Component,

    properties: {
        num: {
            default: null,
            type: cc.Label
        },
        icon: {
            default: null,
            type: cc.Sprite
        },
        nickName: {
            default: null,
            type: cc.Label
        },
        data: {
            default: null,
            type: cc.Label
        }
    },

    //渲染
    setUser: function(num, iconurl, nickName, data) {
        let thisNum = this.num.getComponent(cc.Label);
        thisNum.string = num;
        let thisName = this.nickName.getComponent(cc.Label);
        thisName.string = nickName;
        let thisData = this.data.getComponent(cc.Label);
        thisData.string = data;
        let thisIcon = this.icon;
        if(CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        thisIcon.spriteFrame = new cc.SpriteFrame(texture);
                    } catch(e) {
                        cc.log(e);
                        this.icon.node.active = false;
                    }
                }
                image.src = iconurl;
            } catch(e) {
                cc.log(e);
                this.icon.node.active = false;
            }
        } else {
            cc.loader.load({
                url: iconurl, type: 'png'
            }, (err, texture) => {
                if (err) console.error(err);
                console.log(texture);
                thisIcon.spriteFrame = new cc.SpriteFrame(texture);
            })
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad () {},

    start () {    },

    // update (dt) {},
});
