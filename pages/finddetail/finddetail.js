var conf = getApp().globalData.config, util = getApp().globalData.util, WxParse = require('../../wxParse/wxParse.js');
Page({
	data: {
		row: {},
		parseMsg: '',
		config: conf,
		btext: '播放',
		isplay: 0
	},
	onLoad: function (options) {
		var that = this,
			row = {},
			parseMsg = '',
			id = options.id || 29,
			pid = options.pid || 0,
			url = conf.getDetailImage + '/' + id + '?pid=' + pid;
		util.makeRequest(that, url, {}, function (res) {
			row = res.data
			try {
				WxParse.wxParse('article', 'html', row.description, that, 5);
			} catch (error) {
				row.description = ''
				parseMsg = '富文本解析错误，请重新编辑'
			}
			that.setData({ row: row, parseMsg: parseMsg })
		}, 'GET')
	},

	onReady: function () {
		this.audioCtx = wx.createAudioContext('audio')
		//this.audioCtx.play()
	},

	audioToggle: function () {
		if (this.data.isplay == 0) {
			this.audioCtx.play()
			this.setData({ btext: "暂停" });
			this.setData({ isplay: 1 });
		} else {
			this.audioCtx.pause()
			this.setData({ btext: "播放" });
			this.setData({ isplay: 0 });
		}
	},

	audioPlay: function () {
		this.audioCtx.play()
	},
	audioPause: function () {
		this.audioCtx.pause()
	},


})