// pages/webview/webview.js
var util = getApp().globalData.util;
Page({
	data: {
		url: 'https://dmc.pk4yo.com/html/travel_hdf.html',
		randNum: util.randomNum()
	},
	onLoad: function (options) {
		options.url ? this.setData({ url: options.url }) : '';

	}
});
