// pages/findlist/findlist.js
var config = getApp().globalData.config;
Page({
	data: {
		config: config,
		list: [],
	},

	onLoad: function () {
		let that = this
		wx.getStorage({
			key: 'searchResultData',
			success: function (res) {
				that.setData({ list: res.data })
			}
		})
	},

	goDetail: function (e) {
		var self = this,
			data = e.currentTarget.dataset;
		wx.navigateTo({ url: '../finddetail/finddetail?id=' + data.id })
	}

})