// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		title: '我的',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    authorized: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var _this = this;
    console.log("--- index::onLoad() ---")
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //this.userInfo = res.userInfo
              console.log(res.userInfo)
              console.log("User has authorized before!!!")
              //用户已经授权过
              //this.authorized = true
              _this.setData({
								userInfo: res.userInfo,
								authorized: true,
              })
            },
            fail: function () {
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                          wx.getUserInfo({
                            success: function (res) {
                              var userInfo = res.userInfo;
                              that.setData({
                                nickName: userInfo.nickName,
                                avatarUrl: userInfo.avatarUrl,
                              })
                            }
                          })
                        }
                      }, 
											fail: function (res) {
                        console.log("wx.showModal failed")
                      }
                    })

                  }
                }
              })
            },
            complete: function (res) {
              console.log("wx.getUserInfo complete")
            }

          })
        }
      },
      fail: function () {
        console.log("wx.getSetting failed")
      }
    })

  },

  /**
   * 授权按钮回调函数
   */
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      console.log("user approves")
      //用户按了允许授权按钮
      this.authorized = true
    } else {
      console.log("user rejects")
      //用户按了拒绝按钮
    }
  },

	gotoFav: function () {
		wx.navigateTo({
			url: '/pages/myfavorite/myfavorite'
		})
	},
	gotoHongbao: function () {
		wx.navigateTo({
			url: '/pages/myhongbao/myhongbao'
		})
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
		wx.setNavigationBarTitle({
			title: this.data.title //"项目详情" //this.project.pName
		})

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})