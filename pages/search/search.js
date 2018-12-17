// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []  //定义变长数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  change: function (e) {
    var that = this;
    wx.request({
      url: 'https://zhuabo.pk4yo.com/projects',//自己的服务器地址
      header: {
        "Content-Type": "application/json"
      },
      method: "GET",
      success: function (res) {
        for (var i = 0, len = res.data.data.length; i < len; i++) {
          that.data.items[i] = res.data.data[i];
        }
        that.setData({
          items: that.data.items
        })
        console.log(that.data.items)
      },
      fail: function (res) {
        wx.showToast({
          'title': 'request fail'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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