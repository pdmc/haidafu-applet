// pages/myreservation/myreservation.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "我的预约",
		labels: ['活动', '看房'],
		_num: 0,
		activities: [], // 数据列表	list[]
		reservations: [], // 数据列表
		loading: true, // 显示等待框
		userInfo: {},
		hasUserInfo: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
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

		// 同步activity db，需要userId，异步问题？
		const key1 = 'myactivities';
		var myactivities = wx.getStorageSync(key1) || [];
		if (myactivities.length > 0) {
			this.setData({
				activities: myactivities,
				loading: false // 关闭等待框

			});
		} else {
			const _this = this;
			// 拼接请求url
			const url = app.globalData.main_url + '/myactivity/getbycond?userId=' + userinfo.userId;
			// + options.type;
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
						//var key = "myactivities";
						//var myactivities = wx.getStorageSync(key1) || [];
						for (let i = 0; i < res.data.data.length; i++) {
							var time = res.data.data[i].pkactivity__startTime;
							if (time.length > 16 && time.indexOf('T') > 0) {
								time = time.substr(0, 10) + ' ' + time.substr(11, 5);
							}
							var activity = { "actid": res.data.data[i].pkactivity__actId, "name": res.data.data[i].pkactivity__subject, "address": res.data.data[i].pkactivity__address, "time": time, "image": res.data.data[i].pkactivity__imgurl };
							var myact = { "maid": res.data.data[i].maId, "actid": res.data.data[i].pkactivity__actId, "userid": userinfo.userId, "status": res.data.data[i].status };
							var myactivity = { "maid": res.data.data[i].maId, "userid": userinfo.userId, "actid": res.data.data[i].pkactivity__actId, "activity": activity, "myactivity": myact };
							myactivities.unshift(myactivity);
						}
						wx.setStorage({
							key: key1,
							data: myactivities
						});

						_this.setData({
							activities: myactivities,
							loading: false // 关闭等待框
						});
					}
				} /* success */
			});
		}

		// 同步reservation db，需要userId，异步问题？
		const key2 = 'myreservations';
		var myreservations = wx.getStorageSync(key2) || [];
		if (myreservations.length > 0) {
			this.setData({
				reservations: myreservations,
				loading: false // 关闭等待框
			});
		} else {
			const _this = this;
			// 拼接请求url
			const url = app.globalData.main_url + '/reservations/getbycond?userId=' + userinfo.userId;
			// + options.type;
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
						//var key = "myreservations";
						//var myreservations = wx.getStorageSync(key) || [];
						for (let i = 0; i < res.data.data.length; i++) {
							var project = { "pid": res.data.data[i].pkproject__pId, "name": res.data.data[i].pkproject__pName, "country": res.data.data[i].countryId__area__name, "city": res.data.data[i].cityId__area__name, "lowsq": res.data.data[i].pkproject__minSquare, "highsq": res.data.data[i].pkproject__maxSquare, "lowprice": res.data.data[i].pkproject__minPrice, "highprice": res.data.data[i].pkproject__maxPrice, "image": res.data.data[i].pkproject__thumbnail };
							var applytime = res.data.data[i].applyTime;
							if (applytime.length > 16 && applytime.indexOf('T') > 0) {
								applytime = applytime.substr(0, 10) + ' ' + applytime.substr(11, 5);
							}
							var reservation = { "rid": res.data.data[i].rId, "pid": res.data.data[i].pkproject__pId, "userid": userinfo.userId, "applytime": applytime, "status": res.data.data[i].status, "name": res.data.data[i].trueName, "mobile": res.data.data[i].phone};
							var myreservation = { "rid": res.data.data[i].rId, "userid": _this.data.userInfo.userId, "reservation": reservation, "project": project };
							myreservations.unshift(myreservation);
						}
						wx.setStorage({
							key: key2,
							data: myreservations
						});

						_this.setData({
							reservations: myreservations,
							loading: false // 关闭等待框
						});
					}
				} /* success */
			});
		}
	},
	toggle: function (e) {
		console.log(e.currentTarget.dataset.index);
		if (this.data._num === e.currentTarget.dataset.index) {
			return false;
		} else {
			this.setData({
				_num: e.currentTarget.dataset.index
			})
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