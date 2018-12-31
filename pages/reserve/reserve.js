// pages/reserve/reserve.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '预约看房',
		reserveDate: '2019-01-01',
		iHaveReserved: false,
		pId: -1,
		dateError: false,
		name: '',
		nameError: false,
		mobile: '',
		mobileError: false,
		verify: '',
		verifyError: false,

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
		// 拼接请求url
		//console.log(options.pId);
		this.setData({
			pId: options.pId
		});

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
		const url = 'https://zhuabo.pk4yo.com/reservations/getbycond?pId=' + options.pId + '&userId=' + this.data.userInfo.userId;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				if(res.statusCode == 200 && res.data.data.length > 0){
					var rid = res.data.data[0] ? res.data.data[0].rId:0;
					_this.setData({
						iHaveReserved: true
					});
					/*
					*	更新reservation缓存
					*/
					const key = 'myreservations';
					var myreservations = wx.getStorageSync(key) || [];
					var fi = util.array_find_obj(myreservations, "rid", rid);
					if (fi < 0) {
						myreservations.unshift({ "rid": rid, "reservation": res.data.data[0] });
						wx.setStorage({
							key: key,
							data: myreservations
						});
					} 
				}
			},
			fail: function () {
				console.log('reservation: wx request failed !!!')
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
		this.setData({
			name: name
		});
	},
	mobileInput: function (e) {
		var mobile = e.detail.value;
		if (util.checkMobile(mobile)){
			this.setData({
				mobileError: false
			});
		} else {
			this.setData({
				mobileError: true
			});
		}
		this.setData({
			mobile: mobile
		});
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
		this.setData({
			verify: verify
		});
	},
	
	sendVerify: function () {
		wx.showToast({
			title: '暂时不需要短信验证码！',
			icon: 'success',
			duration: 1000,
			mask: false
		})
	},

	dateChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			reserveDate: e.detail.value
		})
	},

	submit: function(){
		var _this = this;
		if(this.data.name == ''){
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
			const url = 'https://zhuabo.pk4yo.com/reservations/add?pId=' + this.data.pId + '&userId=' + userinfo.userId + '&trueName=' + this.data.name + '&phone=' + this.data.mobile + '&verify=' + this.data.verify + '&source=1&amount=1000';
			// 请求数据
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					//console.log(res.data);
					/*
					 *	更新reservation缓存
					 */
					if (res.statusCode == 200 && res.data.code == 0) {
						var rid = res.data.rId;
						var hbid = res.data.hbId;
						const key1 = "myreservations";
						var reservations = wx.getStorageSync(key1) || [];
						var fi = util.array_find_obj(reservations, "rid", rid);
						if (fi < 0) {
							var reservation = { "rid": rid, "userId": userinfo.userId, "pId": _this.data.pId };
							reservations.unshift({ "rid": rid, "reservation": reservation });
							wx.setStorage({
								key: key1,
								data: reservations
							});
						}
						/*
						*	更新hongbao缓存
						*/
						const key2 = 'myhongbaos';
						var myhongbaos = wx.getStorageSync(key2) || [];
						var fi = util.array_find_obj(myhongbaos, "hbid", hbid);
						if (fi < 0) {
							var hongbao = { "hbid": hbid, "userId": userinfo.userId, "pId": _this.data.pId, "amount": 1000, "source": 1 };
							myhongbaos.unshift({ "hbid": hbid, "hongbao": hongbao });
							wx.setStorage({
								key: key2,
								data: myhongbaos
							});
						} 


						wx.navigateTo({
							url: "/pages/reserveok/reserveok"
						})
					}
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
			var logcb = function(){
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
			title: this.data.title //"项目详情" //this.project.pName
		})

	}
})