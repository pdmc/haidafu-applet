// pages/project/project.js
var util = require('../../utils/util.js');
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
    nextMargin: 0,
    addfav: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      success: function(res) {
        //console.log(res.data);
        // 赋值
        var imgs = [];
        if (res.data.data[0].picture1) imgs.push(res.data.data[0].picture1);
        if (res.data.data[0].picture2) imgs.push(res.data.data[0].picture2);
        if (res.data.data[0].picture3) imgs.push(res.data.data[0].picture3);
        if (res.data.data[0].picture4) imgs.push(res.data.data[0].picture4);
        _this.setData({
          project: res.data.data[0],
          imgUrls: imgs,
          loading: false // 隐藏等待框
        });
				const key = 'myfavorites';
				var pid = res.data.data[0].pId;
				var favs = wx.getStorageSync(key) || [];
				var fi = util.array_find_obj(favs, "pid", pid);
				if (fi >= 0) {
					_this.setData({
						addfav: true
					});
				}				
      },
      fail: function() {
        console.log('wx request failed !!!')
      }
    });

  },

  favChange: function() {
		var added = this.data.addfav;

		if(!added){
			this.setData({
				addfav: true
			});
			const key = 'myfavorites';
			var pid = this.data.project.pId;
			var favs = wx.getStorageSync(key) || [];
			var fi = util.array_find_obj(favs, "pid", pid);
			if(fi == -1) {
				favs.unshift({ "pid": pid, "project": this.data.project });
				wx.setStorage({
					key: key,
					data: favs
				});
			}
		} else {
			this.setData({
				addfav: false
			});
			const key = 'myfavorites';
			var favs = wx.getStorageSync(key);
			if(favs.length == 0){
				console.log("Error: favorite storage incorrect!!!");
				return;
			}
			var pid = this.data.project.pId;
			var fi = util.array_find_obj(favs,"pid",pid);
			console.log(fi);
			favs.splice(fi,1);
			wx.setStorage({
				key: key,
				data: favs
			});
		}
  },

  gotoHongbao: function() {
    wx.navigateTo({
      url: "/pages/reserve/reserve?pId=" + this.data.project.pId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 修改导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.title //"项目详情" //this.project.pName
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})