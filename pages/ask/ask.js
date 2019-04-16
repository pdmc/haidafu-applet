// pages/ask/ask.js
var Mcaptcha = require('../../utils/mcaptcha.js');
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
		allabels: ["买房", "卖房", "交易过户", "贷款", "税收", "其他"]
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
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
		var res = this.mcaptcha.validate(this.data.imgCode);
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