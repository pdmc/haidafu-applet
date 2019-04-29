// pages/answer/answer.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '回答',
		ansText: '',
		reserveDate: '2019-01-01',
		iHaveReserved: false,
		qId: -1,
		question: {},

		//isLogin: false,
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this;
		var question = { "qid": options.qId, "title": options.title, "content": options.content, "userId": options.userId, "createTime": options.createTime, "ansNum": options.ansNum };
		// 拼接请求url
		//console.log(options.project.pName);
		this.setData({
			qId: options.qId,
			question: question
		});

		console.log(question.content)

		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo || userinfo.isLogin == undefined || !userinfo.isLogin) {
			var logcb = function () {
				var userinfo = wx.getStorageSync('userinfo');
				_this.setData({
					userInfo: userinfo,
					hasUserInfo: true
				});
			};
			app.checkUserLogin(logcb);
		} else {
			this.setData({
				userInfo: userinfo,
				hasUserInfo: true
			});
		}
	},

	inputAns: function (e) {
		if (this.data.ansText.length >= 1000) {
			this.setData({
				ansText: this.data.ansText
			});
			return;
		}
		var text = e.detail.value;
		this.setData({
			ansText: text
		});
	},

	submit: function () {
		var _this = this;
		if (this.data.ansText.length < 5) {
			wx.showToast({
				title: '请输入回答（5-1000个字）！',
				icon: 'none',
				duration: 1000,
				mask: false
			});
			return;
		}else {
			var userinfo = wx.getStorageSync('userinfo');

			if (!userinfo || userinfo.userId == undefined) {
				wx.showToast({
					title: '用户未登录！',
					icon: 'none',
					duration: 1500,
					mask: false
				});
				return;
			}
			var time = util.formatTime(new Date());
			var ansNum = parseInt(this.data.question.ansNum) + 1;
			const url = app.globalData.main_url + '/answer/addifnotexist?qId=' + this.data.qId + '&userId=' + userinfo.userId + '&text=' + this.data.ansText + '&createTime=' + time + '&ansNum=' + ansNum;
			// 请求数据
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
						wx.navigateBack({})
				}
			});	/* wx.request */
		} /* if */
	},

	getUserInfo: function (e) {
		console.log(e);
		var _this = this;
		this.setData({
			hasUserInfo: true
		});
		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo) {
			app.globalData.userInfo = e.detail.userInfo;
			wx.setStorage({
				key: "userinfo",
				data: e.detail.userInfo
			});
		}
		if (userinfo && userinfo.userId && userinfo.isLogin) {	// 数据不一致
			this.setData({
				hasUserInfo: true
			});
		} else {
			var logcb = function () {
				var userinfo = wx.getStorageSync('userinfo');
				_this.setData({
					userInfo: userinfo,
					hasUserInfo: true
				});
			};
			app.loginUser(logcb);
		}
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
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title: this.data.title 
		})

	}
})