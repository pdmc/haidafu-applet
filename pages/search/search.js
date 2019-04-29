// pages/search/search.js
const app = getApp();
var util = require('../../utils/util.js');
const HISTNUM = 8;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		keys: [],
		questions: [], // 数据列表
		key: "",
		loading: false, // 显示等待框
		state: 0,
		
		//isLogin: false,
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const _this = this;
		//console.log(options);

		/*var userinfo = wx.getStorageSync('userinfo');
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
		}*/

		const key = 'mysearches';
		var keys = wx.getStorageSync(key) || [];
		this.setData({
			keys: keys
		});
		//var pid = res.data.data[0].pId;
		/*var fi = util.array_find_obj(favs, "pid", pid);
		if (fi >= 0) {
			_this.setData({
				addfav: true
			});
		}
		wx.setStorage({
			key: '',
			data: '',
		})
		*/

	},

	inputKey: function (e) {
		var key = e.detail.value;
		this.setData({
			key: key
		})
	},

	search: function(key){
		var _this = this;
		if(key.length == 0){
			return;
		}
		var titleArr = [];
		var contentArr = [];
		// 拼接请求url
		const url = app.globalData.main_url + '/question/getbycond?title=' + key;
		// + options.type;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				if (res.statusCode == 200 && res.data.data.length >= 0) {
					// 赋值
					for (var i = 0; i < res.data.data.length; i++) {
						res.data.data[i].labels = res.data.data[i].labels.split(',')
					}
					titleArr = res.data.data;
					// 拼接请求url
					const url2 = app.globalData.main_url + '/question/getbycond?content=' + key;
					// + options.type;
					// 请求数据
					wx.request({
						url: url2,
						data: {},
						header: {
							'content-type': 'json' // 默认值
						},
						success: function (res) {
							if (res.statusCode == 200 && res.data.data.length >= 0) {
								// 赋值
								for (var i = 0; i < res.data.data.length; i++) {
									res.data.data[i].labels = res.data.data[i].labels.split(',')
								}
								contentArr = res.data.data;
								if (titleArr.length > 0 || contentArr.length > 0) {
									for (var i = 0; i < titleArr.length; i++) {
										var found = false;
										for (var j = 0; j < contentArr.length; j++) {
											if (titleArr[i].qId == contentArr[i].qId) found = true;
										}
										if (!found) {
											contentArr[contentArr.length] = titleArr[i];
											found = false;
										}
									}
								}
								_this.setData({
									questions: contentArr,
									state: 1,
									loading: false // 关闭等待框
								})
							}
						}
					});	
				}
			}
		});


	},
	submit: function() {
		var _this = this;
		if (this.data.key.length == 0) {
			return;
		}

		this.search(this.data.key);

		const key = 'mysearches';
		var keys = wx.getStorageSync(key) || [];
		var val = this.data.key; //res.data.data[0].val;
	  var fi = util.array_find_obj(keys, "val", val);
		if (fi < 0) {
			if (keys.length >= HISTNUM) keys.pop();
			keys.unshift({"val": val});
			wx.setStorage({
				key: key,
				data: keys,
			});
			this.setData({
				keys: keys
			});
		}
		

	},

	histSubmit: function (e) {
		var key = e.currentTarget.dataset.item;
		this.search(key);
	},
	
	histClear: function (e) {
		const key = 'mysearches';
		wx.setStorage({
			key: key,
			data: [],
		});
		this.setData({
			keys: []
		})
	},

	onShow: function(){
		this.setData({
			state: 0
		})
	}
})