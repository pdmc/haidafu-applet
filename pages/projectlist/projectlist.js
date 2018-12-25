// pages/projectlist/projectlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '加载中...', // 状态
    list: [], // 数据列表
    type: 'us_box', // 数据类型
    loading: true, // 显示等待框

    // 下拉菜单
    menus: ['价格区间','地区','类型','排序'],

    // ---- 遮罩层 ---
    shadow_on: false,
    opickers: [false,false,false,false],
		needAnimation: [false, false, false, false],
    contentHeight: 1000,
    //itemId: 0,      // 默认选中第一个   
  
    // ---- 选项卡1 ---
    tabPriceList: ['不限','￥50万以下', '￥50万-100万', '￥100万-200万', '￥200万-300万', '￥300万-500万', '￥500万-700万','￥700万-1000万','￥1000万以上'],
    tabPriceVals: [0, 50, 100, 200, 300, 500, 700, 1000, 100000000], /* 长度必须与tabPriceList一致 */
		// 价格slider
		priceItemId: 0,      // 默认选中第一个   
		minval: 0,
		maxval: 0,
    leftMin: 0,
		leftMax: 1000,
		rightMin: 0,
		rightMax: 1000,
		leftValue: 0,
		rightValue: 0,
		minprice: 0,
		maxprice: 0, 

		// ---- 选项卡2 ---
		areaList: [],
		countries: ['美国','泰国','菲律宾','马来西亚','越南'],
		provinces: ['加利福尼亚','曼谷直辖区','大马尼拉市','胡志明地区'],
		cities: ['洛杉矶', '曼谷', '马尼拉', '胡志明'],
		cityId: -1,

		// ---- 选项卡3 ---
		layoutList: [],
		tabLayouts: ['1室1厅1卫','2室1厅1卫','2室2厅1卫','3室2厅1卫','3室2厅2卫','4室2厅2卫'],
		tabLayoutVals: [[1, 1, 1], [2, 1, 1], [2, 2, 1], [3, 2, 1], [3, 2, 2], [4, 2, 2]],
		layoutItemId: -1,
		tabTypes: ['独栋别墅', '公寓', '联排别墅', '土地', '商业地产'],
		tabTypeVals: [0,0,0,0,0],
		typeItemId: -1,

		// ---- 选项卡4 ---
		tabOrders: ['智能排序','价格降序','价格升序','面积降序','面积升序'],
		tabOrderVals: [],
		orderItemId: -1,

	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
		console.log(options)
    // 拼接请求url
    const url = 'https://zhuabo.pk4yo.com/projects';
    // + options.type;
    // 请求数据
    wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'json' // 默认值
      },
      success: function(res) {
        console.log(res.data);
        // 赋值
        _this.setData({
          title: '', //res.data.title,
          list: res.data,
          type: 'us_box',
          loading: false // 关闭等待框
        })
      }
    });
		// 请求地区数据
		const url_area = 'https://zhuabo.pk4yo.com/area/';
		// + options.type;
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				// 赋值
				_this.setData({
					areaList: res.data,
					loading: false // 关闭等待框
				})
			}
		});
		const url_layout = 'https://zhuabo.pk4yo.com/layout/get';
		// + options.type;
		// 请求数据
		wx.request({
			url: url,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				// 赋值
				_this.setData({
					list: res.data,
					loading: false // 关闭等待框
				})
			}
		});
  },


  // 带有遮罩层的下拉菜单  
  onPickTabClick: function (e) {
    var idx = e.currentTarget.dataset.index;
    //if (idx != undefined) console.log(idx);
    var ops = this.data.opickers;
		var isactive = false;
		var ani = this.data.needAnimation;
		for (var i = 0; i < ani.length; i++) {
			if (i == idx) ani[i] = true;
			else if(ops[i] == true) ani[i] = true;
			else ani[i] = false;
		}
    for(i = 0;i < ops.length; i++){
			if (i == idx) ops[i] = !ops[i];
			else	ops[i] = false;
			if (ops[i]) isactive = true;
    }
    this.setData({
      opickers: ops,
			shadow_on: isactive,
      needAnimation: ani
    });
  },

	clearModals: function (e) {
		this.setData({
			shadow_on: false,
			opickers: [false, false, false, false]
		});
	},



  /**   
		* 选项卡 1   
		* 
		*/
	clickPick(e) {
		var ids = e.currentTarget.dataset.index;  //获取自定义的id       
		//console.log(ids);
		// tabPriceVals
		var start_price = ids == 0?0:this.data.tabPriceVals[ids - 1];
		var end_price = ids == this.data.tabPriceVals.length-1 ? 1000 :this.data.tabPriceVals[ids];
		this.setData({
			priceItemId: ids,  //把获取的自定义id赋给当前列的id(即获取当前列下标) 
			leftValue: start_price,
			rightValue: end_price,
			minprice: start_price,
			maxprice: end_price
		})
	},
	// 自定义item，编入列表
	clickPick1(e) {
		this.setData({
			priceItemId: this.data.tabPriceVals.length 
		})
	},
	leftChange: function (e) {
		var value = e.detail.value
		this.setData({
			priceItemId: this.data.tabPriceVals.length ,
			leftValue: value
		})
		if (value < that.data.rightValue) {
			var start_price = value;
			var end_price = that.data.rightValue;
			this.setData({
				minprice: start_price,
				maxprice: end_price
			})
		}	else {
			var start_price = that.data.rightValue;
			var end_price = value;
			this.setData({
				minprice: start_price,
				maxprice: end_price
			})
		}
	},
	rightChange: function (e) {
		var value = e.detail.value
		this.setData({
			priceItemId: this.data.tabPriceVals.length ,
			rightValue: value
		})
		if (value < that.data.leftValue) {
			var start_price = value
			var end_price = that.data.leftValue
			this.setData({
				minprice: start_price,
				maxprice: end_price
			})
		}	else {
			var start_price = that.data.leftValue
			var end_price = value
			this.setData({
				minprice: start_price,
				maxprice: end_price
			})
		}
	},
	priceReset: function(e) {
		this.setData({
			priceItemId: 0,      // 默认选中第一个   
			minval: 0,
			maxval: 0,
			leftValue: 0,
			rightValue: 0,
			minprice: 0,
			maxprice: 0  
		});
	},
	priceOk: function(e) {
		this.clearModals();
	},


  /**   
		* 选项卡 2   
		* 
		*/
	areaChange: function (e) {
		const val = e.detail.value;
		console.log(val);
		this.setData({
			cityId: this.data.cities[val[2]]
		});
	},



  /**   
		* 选项卡 3   
		* 
		*/
	layoutChange: function (e) {
		var val = e.currentTarget.dataset.index
		console.log(val)
		this.setData({
			layoutItemId: val
		})
	},
	typeChange: function (e) {
		var val = e.currentTarget.dataset.index
		console.log(val)
		this.setData({
			typeItemId: val
		})
	},
	typeReset: function (e) {
		this.setData({
			layoutItemId: -1,      // 默认选中第一个   
			typeItemId: -1
		});
	},
	typeOk: function (e) {
		this.setData({
			opickers: [false, false, false, false]
		});
	},




  /**   
		* 选项卡 4   
		* 
		*/
	orderChange: function (e) {
		var val = e.currentTarget.dataset.index
		console.log(val)
		this.setData({
			orderItemId: val,
			opickers: [false, false, false, false]
		})
	},





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})