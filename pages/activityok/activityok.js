// pages/activityok/activityok.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '预约成功'
	},

	goHome: function () {
		wx.switchTab({
			url: "../index/index",
			fail: function (e) {
				console.log(e);
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title: this.data.title //"项目详情" //this.project.pName
		})
	}
})