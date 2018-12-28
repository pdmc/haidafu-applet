// pages/activity/activity.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '活动报名',
		activity: {},
		iHaveReserved: true,
		reserveDate: '2019-01-01',
		dateError: false,
		name: '',
		nameError: false,
		mobile: '',
		mobileError: false,
		verify: '',
		verifyError: false,

		userInfo: {},
		hasUserInfo: false,
		isLogin: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const _this = this;
		// 拼接请求url
		console.log(options.actId);

		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
		this.loginUser();
		app.test();
	
	
		const url = 'https://zhuabo.pk4yo.com/activity/getbyid?actId=' + options.actId;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				var activity = res.data.data[0];
				if (activity.startTime.length > 16 && activity.startTime.indexOf('T') > 0) {
					activity.startTime = activity.startTime.substr(0, 10) + ' ' + activity.startTime.substr(11, 5);
				}
				_this.setData({
					activity: activity,
					loading: false // 隐藏等待框
				});
				/*
				 *	判断当前用户是否已预约。
				 */
				/*const key = 'myfavorites';
				var pid = res.data.data[0].pId;
				var favs = wx.getStorageSync(key) || [];
				var fi = util.array_find_obj(favs, "pid", pid);
				if (fi >= 0) {
					_this.setData({
						addfav: true
					});
				}*/
			},
			fail: function () {
				console.log('wx request failed !!!')
			}
		});
	
	},

	nameInput: function (e) {
		var name = e.detail.value;
		let reg = new RegExp('/^[\u4E00-\u9FA5 A-Za-z]+$/');
		if (reg.test(name)) {
			console.log("姓名格式正确");
		}
		if (name.length > 1 && name.length < 50) {
			this.setData({
				nameError: false
			});
		} else {
			this.setData({
				nameError: true
			});
		}
	},

	mobileInput: function (e) {
		var mobile = e.detail.value;
		if (util.checkMobile(mobile)) {
			this.setData({
				mobileError: false
			});
		} else {
			this.setData({
				mobileError: true
			});
		}
	},
	verifyInput: function (e) {
		var verify = e.detail.value;
		if (verify.length == 6) {
			this.setData({
				verifyError: true
			});
		} else {
			this.setData({
				verifyError: false
			});
		}
	},


	goHome: function () {
		wx.navigateTo({
			url: '../index/index',
		})
	},

	submit: function () {
		if (this.data.name == '') {
			this.setData({
				nameError: true
			});
		}
		if (this.data.mobile == '') {
			this.setData({
				mobileError: true
			});
		}
		if (this.data.name == '') {
			this.setData({
				verifyError: true
			});
		}
		if (!this.data.nameError && !this.data.mobileError && !this.data.verifyError) {
			//wx.request();
		}
		wx.navigateTo({
			url: "/pages/reserveok/reserveok"
		})

	},

	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	},

	loginUser: function () {
		if (app.globalData.userInfo && !app.globalData.isLogin) {
			var _this = this;
			var userinfo = app.globalData.userInfo;
			userinfo.code = app.globalData.userCode;
			// 请求数据
			//const url = "https://zhuabo.pk4yo.com/users/login?name=" + app.globalData.userInfo.nickName + "&code=" + app.globalData.userCode;
			const url = "https://zhuabo.pk4yo.com/users/login";
			wx.request({
				url: url,
				method: "POST",
				data: userinfo,
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					if (res.statusCode == 200) {
						console.log(res.data);
						// 赋值
						var uinfo = _this.data.userInfo;
						uinfo.userId = res.data.data.userId;
						_this.setData({
							isLogin: true,
							userInfo: uinfo
						})
					} else {
						console.log(res.errMsg);
					}
				},
				fail: function () {
					console.log('wx request failed !!!')
				}
			});
		}
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