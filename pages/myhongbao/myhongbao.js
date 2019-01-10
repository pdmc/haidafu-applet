// pages/myhongbao/myhongbao.js
const app=getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "我的红包",
		list: [], // 数据列表
		loading: true, // 显示等待框

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
		
		// 同步hongbao db，需要userId，异步问题？
		const key = 'myhongbaos';
		var myhongbaos = wx.getStorageSync(key) || [];
		if(myhongbaos.length > 0){
			this.setData({
				list: myhongbaos
			});
		} else {
			const _this = this;
			// 拼接请求url
			const url = app.globalData.main_url + '/hongbaos/getbycond?userId=' + userinfo.userId;
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
						_this.setData({
							list: res.data.data,
							loading: false // 关闭等待框
						});
						
						for (let i = 0; i < res.data.data.length; i++) {
							var hongbao = { "hbid": res.data.data[i].hbId, "amount": res.data.data[i].amount, "state": res.data.data[i].state};
							var project = { "pid": res.data.data[i].pkproject__pId, "name": res.data.data[i].pkproject__pName, "lowsq": res.data.data[i].pkproject__minSquare, "highsq": res.data.data[i].pkproject__maxSquare, "lowprice": res.data.data[i].pkproject__minPrice, "highprice": res.data.data[i].pkproject__maxPrice, "country": res.data.data[i].area__name, "image": res.data.data[i].pkproject__thumbnail};
							myhongbaos.unshift({ "hbid": res.data.data[i].hbId, "userid": _this.data.userInfo.userId, "hongbao": hongbao, "project": project });
							wx.setStorage({
								key: key,
								data: myhongbaos
							});
						}
					}
				} /* success */
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