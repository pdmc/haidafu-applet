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
		iHaveReserved: false,
		reserveDate: '2019-01-01',
		dateError: false,
		name: '',
		nameError: false,
		mobile: '',
		mobileError: false,
		showerror: '',
		verifytext: '发送验证码',
		verify: '',
		veriId: -1,
		verifyError: false,
		currentTime: 61,

		userInfo: {},
		//isLogin: false,
		//hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const _this = this;
		// 拼接请求url
		//console.log(options.actId);
		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo || userinfo.isLogin == undefined || !userinfo.isLogin) {
			var logcb = function () {
				var userinfo = wx.getStorageSync('userinfo');
				_this.setData({
					userInfo: userinfo
				});
			};
			app.checkUserLogin(logcb);
		} else {
			this.setData({
				userInfo: userinfo
			});
		}
		
		const url = app.globalData.main_url + '/activity/getbyid?actId=' + options.actId;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				if (res.statusCode == 200 && res.data.data.length > 0) {
					var activity = res.data.data[0];
					if (activity.startTime.length > 16 && activity.startTime.indexOf('T') > 0) {
						activity.startTime = activity.startTime.substr(0, 10) + ' ' + activity.startTime.substr(11, 5);
					}
					_this.setData({
						activity: activity,
						loading: false // 隐藏等待框
					});
					
					/*
					*	检查storage缓存，判断当前用户是否已预约。
					*/
					const key = 'myactivities';
					var myactivities = wx.getStorageSync(key) || [];
					var fi = util.array_find_obj(myactivities, "actid", activity.actId);
					if (fi >= 0) {
						_this.setData({
							iHaveReserved: true
						});
					} else if (_this.data.userInfo && _this.data.userInfo.userId > 0) {	// 存在即修正，虚无非真空
						// 拼接请求url
						const url = app.globalData.main_url + '/myactivity/getbycond?actId=' + options.actId + '&userId=' + _this.data.userInfo.userId;
						// 请求数据
						//var _res = res;
						wx.request({
							url: url,
							data: {},
							header: {
								'content-type': 'json' // 默认值
							},
							success: function (res) {
								if (res.statusCode == 200 && res.data.data.length > 0) {
									var time = res.data.data[0].pkactivity__startTime;
									if (time.length > 16 && time.indexOf('T') > 0) {
										time = time.substr(0, 10) + ' ' + time.substr(11, 5);
									}
									var activity = { "actid": res.data.data[0].pkactivity__actId, "name": res.data.data[0].pkactivity__subject, "address": res.data.data[0].pkactivity__address, "time": time, "image": res.data.data[0].pkactivity__imgurl};
									var myactivity = { "maid": res.data.data[0].maId, "userid": _this.data.userInfo.userId, "actid": res.data.data[0].pkactivity__actId, "myactivity": res.data.data[0], "activity": activity};
									myactivities.unshift(myactivity);
									wx.setStorage({
										key: key,
										data: myactivities,
									});
									_this.setData({
										iHaveReserved: true
									});
								}
							}
						});
					}
				}
			},
			fail: function () {
				console.log('wx request failed !!!')
			}
		});
	
	},

	nameInput: function (e) {
		var name = e.detail.value;
		let reg = new RegExp(/^[\u4E00-\u9FA5 A-Za-z]+$/);
		if (reg.test(name)) {
			console.log("姓名格式正确");
		}
		if (name.length > 1 && name.length < 50) {
			this.setData({
				nameError: false,
				name: name
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
				mobileError: false,
				mobile: mobile
			});
		} else {
			this.setData({
				mobileError: true
			});
		}
	},

	verifyInput: function (e) {
		var verify = e.detail.value;
		if (verify.length == 4) {
			this.checkVerify(verify);
		} else {
			this.setData({
				verifyError: true
			});
		}
	},

	sendVerify1: function () {
		wx.showToast({
			title: '暂时不需要短信验证码！',
			icon: 'success',
			duration: 1000,
			mask: false
		})
	},

	sendVerify: function () {
		var _this = this;
		/*
		_this.setData({
			disabled: true,
			color: '#ccc',
		});
		*/
		console.log('Enter sendVerify()');
		var mobile = this.data.mobile;
		var currentTime = _this.data.currentTime //把手机号跟倒计时值变例成js值

		if (!util.checkMobile(mobile)) {
			this.setData({
				mobileError: true,
				showerror: 'showerror'
			});
			return;
		} else {
			var url = app.globalData.main_url + '/verify/sendverify?mobile=' + mobile;
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					//console.log(res.data);
					if (res.statusCode == 200 && res.data.veriId > 0) {
						_this.setData({
							showerror: '',
							veriId: res.data.veriId
						});
					}
				}
			});

			//设置一分钟的倒计时
			var interval = setInterval(function () {
				currentTime--; //每执行一次让倒计时秒数减一
				_this.setData({
					verifytext: currentTime + 's', //按钮文字变成倒计时对应秒数
				})
				if (currentTime <= 0) {
					clearInterval(interval);
					_this.setData({
						verifytext: '发送验证码',
						currentTime: 61
					})
    		}
			}, 1000);

		}

	},

	checkVerify: function (verify) {
		var _this = this;
		var veriId = this.data.veriId;
		var code = parseInt(verify);
		var url = app.globalData.main_url + '/verify/verify?veriId=' + veriId + '&code=' + code;
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				if (res.statusCode == 200) {
					if(res.data.pass){
						_this.setData({
							verifyError: false,
							verify: verify
						});
					}else{
						_this.setData({
							verifyError: true
						});
					}
				}
			}
		});
	},

	goHome: function () {
		//wx.navigateTo({
		//	url: '../index/index',
		//});
		wx.navigateBack();
	},

	submit: function () {
		var _this = this;
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
			const url = app.globalData.main_url + '/myactivity/addifnotexist?actId=' + this.data.activity.actId + '&userId=' + userinfo.userId + '&trueName=' + this.data.name + '&phone=' + this.data.mobile + '&verify=' + this.data.verify + '&status=0';
			// 请求数据
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					//console.log(res.data);
					if (res.statusCode == 200 && res.data.maId > 0) {
						var key = "myactivities";
						var myactivities = wx.getStorageSync(key) || [];
						var time = _this.data.activity.startTime;
						if (time.length > 16 && time.indexOf('T') > 0) {
							time = time.substr(0, 10) + ' ' + time.substr(11, 5);
						}
						var activity = { "actid": _this.data.activity.actId, "name": _this.data.activity.subject, "address": _this.data.activity.address, "time": time, "image": _this.data.activity.imgurl };
						var myact = { "maid": res.data.maId, "actid": _this.data.activity.actId, "userid": userinfo.userId, "status": 0};
						var myactivity = { "maid": res.data.maId, "userid": userinfo.userId, "actid": _this.data.activity.actId, "activity": activity, "myactivity": myact};
						myactivities.unshift(myactivity);
						wx.setStorage({
							key: key,
							data: myactivities
						});

						wx.navigateTo({
							url: "/pages/activityok/activityok"
						});
					}
				}
			});
		}
	},

	getUserInfo: function (e) {
		var _this = this;
		console.log(e);
		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo){
			app.globalData.userInfo = e.detail.userInfo;
			wx.setStorage({
				key: "userinfo",
				data: e.detail.userInfo
			});
		}
		if (userinfo && userinfo.userId && userinfo.isLogin) {	// 数据不一致
			this.setData({
				userInfo: userinfo
			});
		} else {
			var logcb = function () {
				var userinfo = wx.getStorageSync('userinfo');
				_this.setData({
					userInfo: userinfo
				});
			};
			app.loginUser(logcb);
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