// pages/findhome/findhome.js
const app = getApp();
var config = app.globalData.config;
Page({
	data: {
		Height: 0,
		BtnTop: 0,
		image_photo: ''
	},

	onLoad: function (options) {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					Height: res.windowHeight,
					BtnTop: res.windowHeight / 2 - 90,
				});
			}
		});
	},

	choice: function () {
		var that = this
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图
			sourceType: ['camera'], // 可以指定来源是相册还是相机
			success: function (res) {
				wx.showLoading({ "title": "识别中..." });
				var tempFilePaths = res.tempFilePaths
				that.setData({ image_photo: tempFilePaths })
				that.uploadPhoto()
			}
		})
	},

	uploadPhoto: function () {
		var that = this
		wx.uploadFile({
			url: config.searchSimilarImage,
			filePath: that.data.image_photo[0],
			name: 'img',
			formData: {},
			success: function (res) {
				wx.hideLoading();
				res = JSON.parse(res.data);
				wx.setStorage({ key: 'searchResultData', data: res.data });
				if (res.data.length == 0) {
					wx.showModal({ content: "未识别出相关文物，试试其它的吧~", showCancel: false });
				} else {
					wx.navigateTo({ url: '../findlist/findlist' })
				}
			}
		})
	}

})
