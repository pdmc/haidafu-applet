// pages/reserveok/reserveok.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '预约成功'
	},

	goHome: function(){
		wx.navigateTo({
			url: "/pages/index/index"
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