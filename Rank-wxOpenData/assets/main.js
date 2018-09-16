cc.Class({
    extends: cc.Component,

    properties: {
        user: {
            default: null,
            type: cc.Prefab
        },
        display: {
            default: null,
            type: cc.ScrollView
        },
    },

    onLoad: function() {
    },

    start () {
        this.bastScore;
        //获取主域发送的信息
        wx.onMessage(data => {
            switch (data.message) {
                case 'insert':
                    this._insertScore(data.score);
                    break;
            }
        });
        this._updateRank();
    },

    _insertScore (score) {
        score = parseInt(score);
        wx.getUserCloudStorage({
            keyList: ['score'],
            success: res => {
                if(res.KVDataList.length == 0) {
                    var kvDataList = new Array();
                    kvDataList.push({
                        key: "score",
                        value: score+""
                    });
                    wx.setUserCloudStorage({
                        KVDataList: kvDataList,
                        complete: () => {
                            this._updateRank();
                        }
                    });
                } else {
                    this.bastScore = parseInt(res.KVDataList[0].value);
                    if(score > this.bastScore) {
                        var kvDataList = new Array();
                        kvDataList.push({
                            key: "score",
                            value: score+""
                        });
                        wx.setUserCloudStorage({
                            KVDataList: kvDataList,
                            complete: () => {
                                this._updateRank();
                            }
                        });
                    }
                }
            }
        });
    },

    _updateRank () {
        this.display.content.removeAllChildren();
        //获取好友数据
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: res => {
                let data = res.data;
                data.sort((a, b) => {
                    if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                        return 0;
                    }
                    if (a.KVDataList.length == 0) {
                        return 1;
                    }
                    if (b.KVDataList.length == 0) {
                        return -1;
                    }
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                for(let i = 0; i < data.length; i++) {
                    let userItem = cc.instantiate(this.user);
                    let avatarUrl = data[i].avatarUrl;
                    let nickname = data[i].nickname;
                    let score = data[i].KVDataList[0].value;
                    userItem.getComponent("User").setUser(i+1, avatarUrl, nickname, score);
                    this.display.content.addChild(userItem);
                    this.display.content.height += userItem.height;
                }
            }
        })
    }

    // update (dt) {},
});
