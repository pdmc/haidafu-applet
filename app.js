App({
	onLaunch: function () {
		// 展示本地存储能力
		//var logs = wx.getStorageSync('logs') || []
		//logs.unshift(Date.now())
		//wx.setStorageSync('logs', logs)

		// 登录
		wx.login({
			success: res => {
				console.log("------------- wx.login -------------");
				console.log(res);
				this.globalData.userCode = res.code;
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			}
		});
		//this.test();
		// 获取用户信息
		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo) {	
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						wx.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								this.globalData.userInfo = res.userInfo;
								wx.setStorage({
									key: 'userinfo',
									data: res.userInfo,
								});

								// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况
								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res)
								}
							}
						})
					}
				} /* success */
			});
		}
	},
	loginUser: function (callback) {
		var _this = this;
		var userinfo = wx.getStorageSync('userinfo');
		if (userinfo && userinfo.isLogin) {	// 数据不一致
			return true;
		}
		if (userinfo && (userinfo.isLogin == undefined || !userinfo.isLogin)) {
			//var userinfo = app.globalData.userInfo;
			userinfo.code = this.globalData.userCode;
			// 请求数据
			//const url = this.globalData.main_url + "/users/login?name=" + app.globalData.userInfo.nickName + "&code=" + app.globalData.userCode;
			const url = this.globalData.main_url + "/users/login";
			wx.request({
				url: url,
				method: "POST",
				data: userinfo,
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function (res) {
					if (res.statusCode == 200 && res.data.code == 0) {
						console.log(res.data);
						// 赋值
						var uinfo = userinfo; //_this.globalData.userInfo; //_this.data.userInfo;
						uinfo.userId = res.data.userId;
						uinfo.openid = res.data.openid;
						uinfo.isLogin = true;
						_this.globalData.isLogin = true;
						/*_this.setData({
							isLogin: true,
							userInfo: uinfo
						});*/

						wx.setStorage({
							key: "userinfo",
							data: uinfo
						});

						if(callback) callback();
						//return true;
					} else if (res.statusCode == 200 && res.data.code != 0) {
						console.log(res.data.msg);
						//return false;
					} else {
						console.log(res.errMsg);
						//return false;
					}
				},
				fail: function () {
					console.log('wx request failed !!!')
					return false;
				}
			});
		}
	},
	checkUserLogin: function (callback) {
		var _this = this;
		const key = 'userinfo';
		var userinfo = wx.getStorageSync(key);
		if (userinfo.nickName != undefined && userinfo.openId != undefined) {
			if(callback) callback();
		} else if (userinfo.nickName != undefined) {	// app.globalData.userInfo
			/*_this.setData({
				userInfo: userinfo, //app.globalData.userInfo,
				hasUserInfo: true
			});
			app.loginUser();*/
			return this.loginUser(callback);
		} else if (this.globalData.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			this.userInfoReadyCallback = res => {
				/*this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				});*/
				this.globalData.userInfo = res.userInfo;
				this.globalData.hasUserInfo = true;
				return this.loginUser(callback);
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					_this.globalData.userInfo = res.userInfo;
					wx.setStorage({
						key: "userinfo",
						data: res.userInfo
					});
					/*this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					});*/
					return _this.loginUser(callback);
				}
			})
		}
	},
	test: function () {
		console.log('hhhhhhhhhhhhhhhh')
	},
	globalData: {
		main_url: 'https://bhost.pk4yo.com',
		hasUserInfo: false,
		isLogin: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		//isLogin: false,
		userCode: '',
		userInfo: {}
	}
})
