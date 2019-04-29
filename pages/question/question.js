// pages/question/question.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loaded: false,
		title: '问题详情',
		loading: true,
		addfav: false,
		changefav: false,
		favorite: {},
		question: {},
		answers: [],
		userInfo: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const _this = this;

		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo || userinfo.isLogin == undefined || !userinfo.isLogin) {
			var logcb = function () {
				var uinfo = wx.getStorageSync('userinfo');
				_this.setData({
					userInfo: uinfo
				});
			};
			app.checkUserLogin(logcb);
		} else {
			this.setData({
				userInfo: userinfo
			});
		}

		// 获取question详细信息
		const url = app.globalData.main_url + '/question/getbyid?qId=' + options.qId;
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				// 赋值
				if (res.statusCode == 200 && res.data.data.length > 0) {
					res.data.data[0].labels = res.data.data[0].labels.split(',')
					//res.data.data[0].createTime = util.formatTime(res.data.data[0].createTime)
					_this.setData({
						question: res.data.data[0],
						loading: false // 隐藏等待框
					});
					
					// 获取question的answer列表
					const url2 = app.globalData.main_url + '/answer/getbycond?state=1&qId=' + options.qId;
					wx.request({
						url: url2,
						data: {},
						header: {
							'content-type': 'json' // 默认值
						},
						success: function (res) {
							//console.log(res.data);
							// 赋值
							if (res.statusCode == 200 && res.data.data.length > 0) {
								_this.setData({
									answers: res.data.data,
								});

							}
						},
						fail: function () {
							console.log('wx request failed !!!')
						}
					});

					const key = 'myfavquestions';
					var qid = res.data.data[0].qId;
					var favs = wx.getStorageSync(key) || [];
					var fi = util.array_find_obj(favs, "qid", qid);
					if (fi >= 0) {
						_this.setData({
							addfav: true
						});
					} else if (_this.data.userInfo.userId && _this.data.userInfo.userId > 0) {	// 存在即修正，虚无非真空
						// 拼接请求url
						const url3 = app.globalData.main_url + '/favoritequestions/getbycond?articleId=' + qid + '&userId=' + _this.data.userInfo.userId;
						// 请求数据
						//var _res = res;
						wx.request({
							url: url3,
							data: {},
							header: {
								'content-type': 'json' // 默认值
							},
							success: function (res) {
								if (res.statusCode == 200 && res.data.data.length > 0) {
									var favorite = { "fid": res.data.data[0].fId, "qid": qid, "userid": _this.data.userInfo.userId };
									var question = { "qid": qid, "title": _this.data.question.title, "content": _this.data.question.content, "userId": _this.data.question.userId, "createTime": _this.data.question.createTime, "ansNum": _this.data.question.ansNum };
									favs.unshift({ "fid": res.data.data[0].fId, "qid": qid, "favorite": favorite, "question": question }); //res.data.data[0]);
									wx.setStorage({
										key: key,
										data: favs,
									});
									_this.setData({
										favorite: favorite,
										addfav: true
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
		this.setData({
			loaded: true
		});
	},


	favChange: function () {
		var added = this.data.addfav;

		if (this.data.userInfo.userId == undefined || this.data.userInfo.userId <= 0) {
			wx.switchTab({
				url: '/pages/my/my',
			});
			return;
		}

		if (!added) {
			const key = 'myfavquestions';
			var qid = this.data.question.qId;
			var favs = wx.getStorageSync(key) || [];
			var fi = util.array_find_obj(favs, "qid", qid);
			if (fi == -1) {
				var favorite = { "fId": 0, "articleId": qid, "userId": this.data.userInfo.userId };
				var question = { "qid": qid, "title": this.data.question.title, "content": this.data.question.content, "userId": this.data.question.userId, "createTime": this.data.question.createTime, "ansNum": this.data.question.ansNum };
				favs.unshift({ "qid": qid, "fid": 0, "favorite": favorite, "question": question });
				wx.setStorage({
					key: key,
					data: favs
				});
			}
			this.setData({
				changefav: !this.data.changefav,
				addfav: true
			});
		} else {
			const key = 'myfavquestions';
			var favs = wx.getStorageSync(key);
			if (favs.length == 0) {
				console.log("Error: favorite storage incorrect!!!");
				return;
			}
			var qid = this.data.question.qId;
			var fi = util.array_find_obj(favs, "qid", qid);
			console.log(fi);
			favs.splice(fi, 1);
			wx.setStorage({
				key: key,
				data: favs
			});
			this.setData({
				changefav: !this.data.changefav,
				addfav: false
			});
		}
	},

	gotoAns: function () {
		var len = this.data.answers.length;
		for(var i=0; i<len; i++){
			if (this.data.answers[i].userId == this.data.userInfo.userId){
				wx.showToast({
					title: '您已回答过此问题！',
					icon: 'none',
					duration: 1000,
					mask: false
				});
				return;
			}
		}
		wx.navigateTo({
			url: "/pages/answer/answer?qId=" + this.data.question.qId + "&title=" + this.data.question.title + "&content=" + this.data.question.content + "&userId=" + this.data.question.userId + "&createTime=" + this.data.question.createTime + "&ansNum=" + this.data.question.ansNum
		})
	},

	syncFav: function () {
		if (this.data.userInfo.userId == -1 || !this.data.changefav) {
			console.log("question: fav unsync for unlogin user, or unchanged.");
			return;
		}
		var _this = this;
		var added = this.data.addfav;
		if (added) {
			const url = app.globalData.main_url + '/favoritequestions/addifnotexist?articleId=' + _this.data.question.qId + '&userId=' + _this.data.userInfo.userId;
			// 请求数据
			//var _res = res;
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					if (res.statusCode == 200 && res.data.fId > 0) {
						console.log("addifnotexist");
						const key = 'myfavquestions';
						var qid = _this.data.question.qId;
						var favs = wx.getStorageSync(key) || [];
						var fi = util.array_find_obj(favs, "qid", qid);
						if (fi == -1) {
							var favorite = { "fId": res.data.fId, "qId": qid, "userId": _this.data.userInfo.userId };
							var question = { "qid": qid, "title": _this.data.question.title, "content": _this.data.question.content, "userId": _this.data.question.userId, "createTime": _this.data.question.createTime, "ansNum": _this.data.question.ansNum };
							favs.unshift({ "qid": qid, "fid": res.data.fId, "favorite": favorite, "question": question });
							wx.setStorage({
								key: key,
								data: favs
							});
						} else if (favs[fi].fid == 0) {
							console.log(favs[fi])
							favs[fi].fid = res.data.fId
							favs[fi].favorite.fid = res.data.fId
							wx.setStorage({
								key: key,
								data: favs
							});
						}
					}
				}
			});
		} else {
			const key = 'myfavquestions';
			var favs = wx.getStorageSync(key);
			var qid = this.data.question.qId;
			var fi = util.array_find_obj(favs, "qid", qid);	// not pid and fid???
			if (fi >= 0 && favs.length > 0) {
				console.log(fi);
				favs.splice(fi, 1);
				wx.setStorage({
					key: key,
					data: favs
				});
			}

			const url = app.globalData.main_url + '/favoritequestions/delete?fId=' + _this.data.favorite.fId;
			// 请求数据
			//var _res = res;
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					if (res.statusCode == 200 && res.data.code == 0) {
						console.log("delete ok");
					}
				}
			});

		}
	},

  /**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function () {
		this.syncFav();
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.syncFav();
	},
	goHome: function () {
		wx.switchTab({
			url: "../index/index",
			fail: function (e) {
				console.log(e);
			}
		})
	},

	onShow: function () {
		var _this = this;
		if (!this.data.loaded) {
			// 获取question的answer列表
			const url2 = app.globalData.main_url + '/answer/getbycond?state=1&qId=' + this.data.question.qId;
			wx.request({
				url: url2,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					//console.log(res.data);
					// 赋值
					if (res.statusCode == 200 && res.data.data.length > 0) {
						_this.setData({
							answers: res.data.data,
						});

					}
				}
			});

		}
		this.setData({
			loaded: false
		});
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