// index.js
// const app = getApp()

// 1. 获取数据库引用
const db = wx.cloud.database()

Page({
    data: {
        list: [],
        name: "",
        password: "",
        openid: ""
    },

    // 获取openid
    getOpenid: function () {
        // 清空数据
        let empty = callback => {
            db.collection('op').where({
                type: "获取openid用"
            }).remove({
                success: function(res) {
                    callback()
                }
            })
        }
        // 添加一条数据
        let addData = callback => {
            db.collection('op').add({
                data: {
                    type: '获取openid用',
                    time: new Date()
                }
            }).then(res => {
                callback()
            })
        }
        // 查询添加的数据，不出意外数据只有一条，那条数据携带openid即当前帐号openid
        let getData = callback => {
            db.collection('op').get().then(res => {
                callback(res.data)
            })
        }
        empty(() => {
            addData(() => {
                getData(res => {
                    let data = res[0]
                    this.setData({
                        openid: data._openid
                    })
                })
            })
        })
    },

    // 新增wifi
    dbadd: function () {
        wx.navigateTo({
            url: '/pages/add/index',
        })
    },
    edit: function (options) {
        let id = options.target.dataset.id
        let el = this.data.list.filter(el => el._id === id)[0]
        wx.navigateTo({
            url: `/pages/add/index?openid=${el._openid}&id=${id}&name=${el.name}&password=${el.password}`,
        })
    },
    // 删除
    remove: function (options) {
        let id = options.target.dataset.id
        let _this = this
        db.collection('wifi').doc(id).remove({
            success: function(res) {
                wx.showToast({
                    title: "删除成功",
                    mask: true,
                    icon: "success"
                })
                let arr = JSON.parse(JSON.stringify(_this.data.list))
                let index = 0
                arr.some((el, i) => {
                    if (el._id === id) {
                        index = i
                        return true
                    }
                })
                arr.splice(index, 1)
                _this.setData({
                    list: arr
                })
            }
        })
    },

    // 查询wifi
    getList: function () {
        // 筛选条件，各字段关系为“与”
        let params = {
            // _openid: 'oQZL60LnIswG1qAsi5PcTfWJkbxg'
        }
        db.collection('wifi').where(params).get().then(res => {
            console.log(res.data)
            this.setData({
                list: res.data
            })
        })
    },

    // 连接wifi
    connect: function () {
        let isConnect = false // 是否已连接wifi
        wx.getConnectedWifi({
            success: res => {
                isConnect = true
                wx.showToast({
                    title: "已连接WIFI!",
                    mask: true
                })
            },
            fail: error => {
                isConnect = false
            }
        })

        if (!isConnect) {
            wx.showToast({
                title: "连接中...",
                icon: "loading",
                mask: true
            })

            let i = 0, ok = false, max = this.data.list.length
            let connect = () => {
                let el = this.data.list[i]
                console.log(i)
                wx.connectWifi({
                    SSID: el.name,
                    password: el.password,
                    success: res => {
                        wx.showToast({
                            title: "连接成功!",
                            icon: "success",
                            mask: true
                        })
                    },
                    fail: error => {
                        if (i === max - 1) {
                            wx.showToast({
                                title: "连接失败!",
                                icon: "error",
                                mask: true
                            })
                        } else {
                            i++
                            connect()
                        }
                    }
                })
            }
            connect()
        }
    },

    // 初始化wifi
    init: function () {
        wx.startWifi({
            success: res => {
                this.connect()
            },
            fail: error => {
                wx.showToast({
                    title: "wifi初始化失败",
                    icon: "error",
                    mask: true
                })           
            }
        })
    },

    onLoad: function () {
        this.getOpenid()
    },
    onShow: function () {
        this.getList()
    }

});
