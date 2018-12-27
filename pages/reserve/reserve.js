// pages/reserve/reserve.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '预约看房',
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
		//console.log(options.pId);

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
	checkMobile: function (mobile) {
		let reg = new RegExp('/^1\d{10}$/');
		if (reg.test(mobile)) {
			return true
		} else {
			return false
		}
	},
	mobileInput: function (e) {
		var mobile = e.detail.value;
		if (this.checkMobile(mobile)){
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
	

	dateChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			reserveDate: e.detail.value
		})
	},

	submit: function(){
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
		if (!this.data.nameError && !this.data.mobileError && !this.data.verifyError){
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

	loginUser: function(){
		if (app.globalData.userInfo && !app.globalData.isLogin){
			var _this = this;
			// 请求数据
			const url = "https://zhuabo.pk4yo.com/users/login?name=" + app.globalData.userInfo.nickName + "&code=" + app.globalData.userCode;
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					console.log(res.data);
					// 赋值
					var uinfo = _this.data.userInfo;
					uinfo.userId = res.data.data.userId;
					_this.setData({
						isLogin: true,
						userInfo: uinfo
					})
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