// pages/project/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    loading: true,
    project: {},
    imgUrls: [
      'http://image.pk4yo.com/tooopen_sy_143912755726.jpg',
      'http://image.pk4yo.com/tooopen_sy_175866434296.jpg',
      'http://image.pk4yo.com/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // 拼接请求url
    const url = 'https://zhuabo.pk4yo.com/projects/getbyid?pId=' + options.pId;
      // 请求数据
      wx.request({
        url: url,
        data: {},
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          // 赋值
          _this.setData({
            project: res.data.data[0],
            loading: false // 隐藏等待框
          })
        },
        fail: function() {
          console.log('wx request failed !!!')
        }
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 修改导航栏标题
    wx.setNavigationBarTitle({
      title: "abc" //this.project.pName
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