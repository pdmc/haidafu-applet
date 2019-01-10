// pages/myfavorite/myfavorite.js
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "我的收藏",
		list: [], // 数据列表
		loading: true, // 显示等待框

		txtStyle: [],
		startX: 0,
		editIndex: -1,
		delBtnWidth: 150, //删除按钮宽度单位（rpx）
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const key = 'myfavorites';
		var favs = wx.getStorageSync(key) || [];
		this.setData({
			list: favs
		});
	},


	//手指刚放到屏幕触发
	touchStart: function (e) {
		console.log("touchS" + e);
		//判断是否只有一个触摸点
		if (e.touches.length == 1) {
			this.setData({
				//记录触摸起始位置的X坐标
				startX: e.touches[0].clientX
			});
		}
	},
	//触摸时触发，手指在屏幕上每移动一次，触发一次
	touchMove: function (e) {
		console.log("touchM:" + e.touches[0].clientX);
		var that = this
		if (e.touches.length == 1) {
			//记录触摸点位置的X坐标
			var moveX = e.touches[0].clientX;
			//计算手指起始点的X坐标与当前触摸点的X坐标的差值
			var disX = that.data.startX - moveX;
			//delBtnWidth 为右侧按钮区域的宽度
			var delBtnWidth = that.data.delBtnWidth;
			var txtStyle = "";
			if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
				txtStyle = "left:0px";
			} else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
				txtStyle = "left:-" + disX + "px";
				if (disX >= delBtnWidth) {
					//控制手指移动距离最大值为删除按钮的宽度
					txtStyle = "left:-" + delBtnWidth + "px";
				}
			}
			//获取手指触摸的是哪一个item
			var index = e.currentTarget.dataset.index;
			var stylelist = that.data.txtStyle;
			stylelist[index] = txtStyle;
			//将拼接好的样式设置到当前item中
			//list[index].txtStyle = txtStyle;
			//更新列表的状态
			this.setData({
				txtStyle: stylelist
			});
		}
	},
	touchEnd: function (e) {
		console.log("touchE" + e);
		var that = this;
		if (e.changedTouches.length == 1) {
			//手指移动结束后触摸点位置的X坐标
			var endX = e.changedTouches[0].clientX;
			//触摸开始与结束，手指移动的距离
			var disX = that.data.startX - endX;
			var delBtnWidth = that.data.delBtnWidth;
			//如果距离小于删除按钮的1/2，不显示删除按钮
			var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
			//获取手指触摸的是哪一项
			var index = e.currentTarget.dataset.index;
			var stylelist = that.data.txtStyle;
			stylelist[index] = txtStyle;
			//将拼接好的样式设置到当前item中
			//list[index].txtStyle = txtStyle;
			//更新列表的状态
			this.setData({
				txtStyle: stylelist,
				editIndex: index
			});
		}
	},

	delItem: function(){
		if(this.data.editIndex >= 0){
			console.log(this.data.editIndex);
			var index = e.target.dataset.index;
			const key = 'myfavorites';
			var favs = wx.getStorageSync(key);
			if (favs.length == 0) {
				console.log("Error: favorite storage incorrect!!!");
				return;
			}
			var pid = this.data.list[index].pId;
			var fi = util.array_find_obj(favs, "pid", pid);
			console.log(fi);
			favs.splice(fi, 1);
			wx.setStorage({
				key: key,
				data: favs
			});
			//更新列表的状态
			this.setData({
				list: favs
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