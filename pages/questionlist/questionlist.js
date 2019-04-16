// pages/questionlist/questionlist.js
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		title: '问答', // 状态
		questions: [], // 数据列表
		loading: true, // 显示等待框

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const _this = this;
		//console.log(options);
		// 拼接请求url
		const url = app.globalData.main_url + '/question';
		// + options.type;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				if (res.statusCode == 200 && res.data.data.length > 0) {
					// 赋值
					for (var i = 0; i < res.data.data.length; i++){
						res.data.data[i].labels = res.data.data[i].labels.split(',')
					}
					_this.setData({
						questions: res.data.data,
						loading: false // 关闭等待框
					})
				}
			}
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title: this.data.title 
		})
	}
})