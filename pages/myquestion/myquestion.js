// pages/myquestion/myquestion.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loaded: false,
		loading: true,
		questions: [],
		userInfo: {}

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this;
		const url = app.globalData.main_url + '/users/getbyid?userId=' + options.userId;
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				// 赋值
				if (res.statusCode == 200 && res.data.data.length > 0) {
					_this.setData({
						userInfo: res.data.data[0],
						loading: false // 隐藏等待框
					});
				}
			},
			fail: function () {
				console.log('wx request failed !!!')
			}
		});

		const url2 = app.globalData.main_url + '/question/getbycond?state=1&userId=' + options.userId;
		wx.request({
			url: url2,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				// 赋值
				if (res.statusCode == 200 && res.data.data.length > 0) {
					for (var i = 0; i < res.data.data.length; i++) {
						res.data.data[i].labels = res.data.data[i].labels.split(',')
					}
					_this.setData({
						questions: res.data.data
					});
				}
			},
			fail: function () {
				console.log('wx request failed !!!')
			}
		});
	},

})