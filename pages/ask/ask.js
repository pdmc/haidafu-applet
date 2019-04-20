// pages/ask/ask.js
var Mcaptcha = require('../../utils/mcaptcha.js');
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "",
		imgCode: "",
		cvs: {
			width: 160,
			height: 70
		},
		content: "",
		labels: "",
		allabels: ["买房", "卖房", "交易过户", "贷款", "税收", "其他"],
		chooseLabels: []
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var lnum = this.data.allabels.length;
		var choose = [];
		for (var i = 0; i< lnum; i++){
			choose[i] = false
		}
		this.setData({
			chooseLabels: choose
		});

		var userinfo = wx.getStorageSync('userinfo');
		if (!userinfo || userinfo.userId == undefined) {
			wx.showToast({
				title: '用户未登录！',
				icon: 'none',
				duration: 1500,
				mask: false
			});
			wx.switchTab({
				url: '/pages/my/my?needBack=ask',
			})
			return;
		}else{
			this.setData({
				userId: userinfo.userId
			});
		}

	},

	inputTitle: function (e) {
		if(this.data.title.length >= 30){
			this.setData({
				title: this.data.title
			});
			return;
		}
		var text = e.detail.value;
		console.log(this.data.title)
		console.log(text)
		this.setData({
			title: text
		});

	},

	inputContent: function (e) {
		if (this.data.content.length >= 500) {
			this.setData({
				content: this.data.content
			});
			return;
		}
		var text = e.detail.value;
		this.setData({
			content: text
		});
	},

	labelToggle: function (e) { 
		var i = e.currentTarget.dataset.index;
		var choose = this.data.chooseLabels;
		choose[i] = !choose[i];
		this.setData({
			chooseLabels: choose
		});
	},

	/**生成字母数组**/
	getAllLetter: function () {
		var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
		return letterStr.split(",");
	},
	getAllLetterNum: function () {
		var letterStr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
		return letterStr.split(",");
	},
	randomNum: function (min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	},
	createCode: function(len) {
		var letterArr = this.getAllLetterNum();
		var code = '';
		for(var i = 0; i<len; i++){
			
			code += letterArr[this.randomNum(0, letterArr.length)];
		}
		return code;
	},

	inputVerify: function (e) {
		var code = e.detail.value;
		this.setData({
			imgCode: code
		});
	},
	submit: function () {
		var _this = this;
		var res = this.mcaptcha.validate(this.data.imgCode);
		var labels = "";
		if (this.data.imgCode == '' || this.data.imgCode == null) {
			wx.showToast({
				title: '请输入图形验证码！',
				icon: 'none',
				duration: 1000,
				mask: false
			})
			return;
		}
		if (!res) {
			wx.showToast({
				title: '图形验证码错误！',
				icon: 'none',
				duration: 1000,
				mask: false
			})
			return;
		}
		var lnum = this.data.allabels.length;
		for (var i = 0; i < lnum; i++) {
			if (this.data.chooseLabels[i] && labels.length == 0) labels += this.data.allabels[i]
			else if (this.data.chooseLabels[i]) labels += "," + this.data.allabels[i]
		}
		if (this.data.title.length < 5 || this.data.content.length == 0 || labels.length == 0){
			wx.showToast({
				title: '请输入必填项！',
				icon: 'none',
				duration: 1000,
				mask: false
			})
		}

		if (true) {
			var time = util.formatTime(new Date());
			const url = app.globalData.main_url + '/question/addifnotexist?title=' + this.data.title + '&userId=' + this.data.userId + '&content=' + this.data.content + '&labels=' + labels + '&createTime=' + time;
			// 请求数据
			wx.request({
				url: url,
				data: {},
				header: {
					'content-type': 'json' // 默认值
				},
				success: function (res) {
					//console.log(res.data);
					if (res.statusCode == 200 && res.data.qId > 0) {
						wx.switchTab({
							url: "../questionlist/questionlist"
						});
					}
				}
			});
		}
	},

	onTap() {
		var code = this.createCode(4);
		this.mcaptcha.refresh(code);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title: "提问"
		});
		var code = this.createCode(4);
		this.mcaptcha = new Mcaptcha({
			el: 'canvas',
			width: this.data.cvs.width/3,
			height: this.data.cvs.height/3,
			code: code
		});
	}
})