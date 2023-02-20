// index.js
// const app = getApp()

// 1. 获取数据库引用
const db = wx.cloud.database()

Page({
    data: {
        list: [],
        name: "",
        password: ""
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
            wx.startWifi({
                success: s => {
                    wx.showToast({
                        title: "连接中...",
                        icon: "loading",
                        mask: true
                    })
        
                    let i = 0, ok = false, max = this.data.list.length
                    let connect = () => {
                        let el = this.data.list[i]
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
                },
                fail: error => {
                    wx.showToast({
                        title: "wifi初始化失败",
                        icon: "error",
                        mask: true
                    }) 
                }
            })
            
        }
    },
    // 连接单个wifi
    connectOne: function (options) {
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
            let id = options.target.dataset.id
            wx.startWifi({
                success: res => {
                    wx.showToast({
                        title: "连接中...",
                        icon: "loading",
                        mask: true
                    })
                    let el = this.data.list.filter(el => el._id === id)[0]
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
                            wx.showToast({
                                title: "连接失败!",
                                icon: "error",
                                mask: true
                            })
                        }
                    })
                },
                fail: error => {
                    wx.showToast({
                        title: "wifi初始化失败",
                        icon: "error",
                        mask: true
                    })           
                }
            })
        }
    },

    onLoad: function () {
        
    },
    onShow: function () {
        this.getList()
    }

});
