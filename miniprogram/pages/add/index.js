// pages/add/index.js
// 1. 获取数据库引用
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        openid: '',
        name: '',
        password: '',
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getList()
        this.setData({
            openid: options.openid
        })
        if (options.id) {
            this.setData({
                id: options.id,
                name: options.name,
                password: options.password
            })
        }
    },

    inputchange: function () {},

    add: function () {
        let name = this.data.name.split(' ').join('')
        let password = this.data.password.split(' ').join('')
        if (this.data.name === '') {
            wx.showToast({
                title: "WiFi名称不能为空",
                mask: true,
                icon: 'error'
            })
            return
        }

        let arr = this.data.list.filter(el => el.name === name)
        if (arr.length) {
            wx.showToast({
                title: "WiFi名称不能重复",
                mask: true,
                icon: 'error'
            })
            return
        }
        console.log(this.data)
        db.collection('wifi').add({
            data: {
                name: this.data.name,
                password: this.data.password
            },
            success: function(res) {
                wx.showToast({
                    title: "创建成功",
                    mask: true,
                    icon: 'success',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 1500)
                    }
                })
            },
            fail: er => {
                wx.showToast({
                    title: "创建失败",
                    mask: true,
                    icon: 'error'
                })
            }
        })
    },
    edit: function () {
        let name = this.data.name.split(' ').join('')
        let password = this.data.password.split(' ').join('')
        if (this.data.name === '') {
            wx.showToast({
                title: "WiFi名称不能为空",
                mask: true,
                icon: 'error'
            })
            return
        }

        let arr = this.data.list.filter(el => {
            return el._id !== this.data.id && el.name === name
        })
        if (arr.length) {
            wx.showToast({
                title: "WiFi名称不能重复",
                mask: true,
                icon: 'error'
            })
            return
        }

        db.collection('wifi').doc(this.data.id).update({
            data: {
                name: this.data.name,
                password: this.data.password
            },
            success: function(res) {
                wx.showToast({
                    title: "修改成功",
                    mask: true,
                    mode: 'success',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 1500)
                    }
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
})