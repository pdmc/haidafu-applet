// pages/projectlist/projectlist.js
const app = getApp();
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
		countries: [],
		countryIds: [],
		provinces: [],
		provinceIds: [],
		cities: [],
		cityIds: [],
		cityId: -1,
		lastval: [],

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
		postCols: [],
		post: {}
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
		//console.log(options);
    // 拼接请求url
		const url = app.globalData.main_url + '/projects';
    // + options.type;
    // 请求数据
    wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'json' // 默认值
      },
      success: function(res) {
				if (res.statusCode == 200 && res.data.data.length > 0) {
					// 赋值
					_this.setData({
						list: res.data.data,
						loading: false // 关闭等待框
					})
				}
      }
    });
		// 请求地区数据
		const url_area = app.globalData.main_url + '/areas/';
		// + options.type;
		wx.request({
			url: url_area,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				if (res.statusCode == 200 && res.data.data.length > 0) {
					var countries = [];
					var countryIds = [];
					var provinces = [];
					var provinceIds = [];
					var cities = [];
					var cityIds = [];
					for (let i = 0; i < res.data.data.length; i++) {
						if(res.data.data[i].level == 1){
							countries.push(res.data.data[i].name);
							countryIds.push(res.data.data[i].addrId);
						} else if (res.data.data[i].level == 2) {
							provinces.push(res.data.data[i].name);
							provinceIds.push(res.data.data[i].addrId);
						} else if (res.data.data[i].level == 3) {
							cities.push(res.data.data[i].name);
							cityIds.push(res.data.data[i].addrId);
						}
					}
					_this.setData({
						areaList: res.data.data,
						countries: countries,
						countryIds: countryIds,
						/*provinces: provinces,
						provinceIds: provinceIds,
						cities: cities,
						cityIds: cityIds,*/
						loading: false // 关闭等待框
					})
				}
			}
		});
		// 请求户型图数据
		const url_layout = app.globalData.main_url + '/layouts/';
		// + options.type;
		wx.request({
			url: url_layout,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				if (res.statusCode == 200 && res.data.data.length > 0) {
					// 赋值
					var name = '';
					var value = [];
					var names = [];
					var values = [];
					for (let i = 0; i < res.data.data.length; i++ ){
						name = '';
						value = [];
						if (res.data.data[i].bedroomNum && res.data.data[i].bedroomNum > 0){
							name = name + res.data.data[i].bedroomNum + '室';
							value[0] = res.data.data[i].bedroomNum;
						} else {
							name = name + '1室';
							value[0] = 1;
						}
						if (res.data.data[i].livingroomNum && res.data.data[i].livingroomNum > 0) {
							name = name + res.data.data[i].livingroomNum + '厅';
							value[1] = res.data.data[i].livingroomNum;
						} else {
							name = name + '1厅';
							value[1] = 1;
						}
						if (res.data.data[i].bathroomNum && res.data.data[i].bathroomNum > 0) {
							name = name + res.data.data[i].bathroomNum + '卫';
							value[2] = res.data.data[i].bathroomNum;
						} else {
							name = name + '1卫';
							value[2] = 1;
						}
						if (names.indexOf(name) < 0) {
							names.push(name);
							values.push(value);
						}
					}
					_this.setData({
						tabLayouts: names,
						tabLayoutVals: values,
					})
				}
			}
		});

		// 请求物业类型数据
		const url_fitment = app.globalData.main_url + '/fitments';
		// + options.type;
		wx.request({
			url: url_fitment,
			data: {},
			header: {
				'content-type': 'json' // 默认值
			},
			success: function (res) {
				//console.log(res.data);
				if (res.statusCode == 200 && res.data.data.length > 0) {
					var names = [];
					var values = [];
					for (let i = 0; i < res.data.data.length; i++) {
						if (names.indexOf(res.data.data[i].name) < 0) {
							names.push(res.data.data[i].name);
							values.push(res.data.data[i].ftId);
						}
					}
					_this.setData({
						tabTypes: names,
						tabTypeVals: values,
					})
				}
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

	postRemove: function (arr) {
		if(!Array.isArray(arr) || arr.length == 0)
			return;

		var post = this.data.post;
		var postcols = this.data.postCols;
		var newpost = {};
		var idx = -1;
		var i = -1;

		for(i = 0; i < arr.length; i++){
			var idx = postcols.indexOf(arr[i]);
			if (idx >= 0) postcols.splice(idx, 1);
		}

		for (i = 0; i < postcols.length; i++) {
			if (post[postcols[i]] != undefined && post[postcols[i]] != '') {
				newpost[postcols[i]] = post[postcols[i]];
			}
		}
		this.setData({
			postCols: postcols,
			post: newpost
		});
	},

	submit: function () {
		var _this = this;
		var post = this.data.post;
		var postcols = this.data.postCols;
		var newpost = {};

		for (let i = 0; i < postcols.length; i++) {
			if (post[postcols[i]] != undefined && post[postcols[i]] != '') {
				newpost[postcols[i]] = post[postcols[i]];
			}
		}

		const url = app.globalData.main_url + '/projects/getbycond';
		// + options.type;
		// 请求数据
		/*_this.setData({
			loading: true // 打开等待框
		})*/
		wx.request({
			url: url,
			method: "POST",
			data: newpost,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.statusCode == 200 && res.data.data.length > 0) {
					// 赋值
					_this.setData({
						list: res.data.data,
						loading: false // 关闭等待框
					})
				}
			}
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
		var post = this.data.post;
		var postcols = this.data.postCols;
		post.minPrice = start_price;
		post.maxPrice = end_price;
		if (postcols.indexOf("minPrice") < 0) postcols.push("minPrice");
		if (postcols.indexOf("maxPrice") < 0) postcols.push("maxPrice");
		this.setData({
			priceItemId: ids,  //把获取的自定义id赋给当前列的id(即获取当前列下标) 
			leftValue: start_price,
			rightValue: end_price,
			minprice: start_price,
			maxprice: end_price,
			post: post,
			postCols: postcols
		})
	},
	// 自定义item，编入列表
	clickPick1(e) {
		this.setData({
			priceItemId: this.data.tabPriceVals.length 
		})
	},
	leftChange: function (e) {
		var value = e.detail.value;
		var post = this.data.post;
		var postcols = this.data.postCols;
		var start_price = -1;
		var end_price = -1;
		this.setData({
			priceItemId: this.data.tabPriceVals.length ,
			leftValue: value
		})
		if (value < this.data.rightValue) {
			start_price = value;
			end_price = this.data.rightValue;
		}	else {
			start_price = this.data.rightValue;
			end_price = value;
		}
		post.minPrice = start_price;
		post.maxPrice = end_price;
		if (postcols.indexOf("minPrice") < 0) postcols.push("minPrice");
		if (postcols.indexOf("maxPrice") < 0) postcols.push("maxPrice");
		this.setData({
			minprice: start_price,
			maxprice: end_price,
			post: post,
			postCols: postcols
		})
	},
	rightChange: function (e) {
		var value = e.detail.value
		var post = this.data.post;
		var postcols = this.data.postCols;
		var start_price = -1;
		var end_price = -1;
		this.setData({
			priceItemId: this.data.tabPriceVals.length ,
			rightValue: value
		})
		if (value < this.data.leftValue) {
			start_price = value
			end_price = this.data.leftValue
		}	else {
			start_price = this.data.leftValue
			end_price = value
		}
		post.minPrice = start_price;
		post.maxPrice = end_price;
		if (postcols.indexOf("minPrice") < 0) postcols.push("minPrice");
		if (postcols.indexOf("maxPrice") < 0) postcols.push("maxPrice");
		this.setData({
			minprice: start_price,
			maxprice: end_price,
			post: post,
			postCols: postcols
		})
	},
	priceReset: function(e) {
		this.postRemove(["minPrice", "maxPrice"]);
		this.setData({
			priceItemId: 0,      // 默认选中第一个   
			leftValue: 0,
			rightValue: 0,
			minprice: 0,
			maxprice: 0
		});
	},
	priceOk: function(e) {
		this.clearModals();
		this.submit();
	},


  /**   
		* 选项卡 2   
		* 
		*/
	areaChange: function (e) {
		const val = e.detail.value;
		var change = -99;
		var idx = -1;
		var provinces = [];
		var provinceIds = [];
		var cities = [];
		var cityIds = [];
		var post = {};
		var postcols = [];
		if(val[0] > 0 && this.data.lastval.length == 0){
			change = 0;
		}
		if (val[0] > 0 && val[0] != this.data.lastval[0]) change = 0;
		else if (val[0] == 0 && val[0] != this.data.lastval[0]) change = -1;
		else if (val[1] > 0 && val[1] != this.data.lastval[1]) change = 1;
		else if (val[1] == 0 && val[1] != this.data.lastval[1]) change = -2;
		else if (val[2] > 0 && val[2] != this.data.lastval[2]) change = 2;
		console.log(val);
		// 先添加国省市，再根据情况删除
		postcols = this.data.postCols;
		if (postcols.indexOf("countryId") < 0) postcols.push("countryId");
		if (postcols.indexOf("provinceId") < 0) postcols.push("provinceId");
		if (postcols.indexOf("cityId") < 0) postcols.push("cityId");
		this.setData({
			postCols: postcols
		});
		// 根据情况
		if(change == 0){	// 选择国家
			cities = [];
			cityIds = [];
			idx = this.data.countryIds[val[0]-1];
			for (let i = 0; i < this.data.areaList.length; i++){
				if (this.data.areaList[i].parentId == idx) {
					provinces.push(this.data.areaList[i].name);
					provinceIds.push(this.data.areaList[i].addrId);
				}
			}
			post = this.data.post;
			post.countryId = this.data.countryIds[val[0] - 1];
			this.postRemove(["provinceId","cityId"]);
			this.setData({
				lastval: val,
				provinces: provinces,
				provinceIds: provinceIds,
				cities: cities,
				cityIds: cityIds,
				post: post
			});
		} else if (change == 1) {	// 选择省份
			idx = this.data.provinceIds[val[1]-1];
			for (let i = 0; i < this.data.areaList.length; i++) {
				if (this.data.areaList[i].parentId == idx) {
					cities.push(this.data.areaList[i].name);
					cityIds.push(this.data.areaList[i].addrId);
				}
			}
			post = this.data.post;
			post.provinceId = this.data.provinceIds[val[1] - 1];
			this.postRemove(["cityId"]);
			this.setData({
				lastval: val,
				cities: cities,
				cityIds: cityIds,
				post: post
			});
		} else if (change == 2) {	// 选择城市
			post = this.data.post;
			post.cityId = this.data.cityIds[val[2] - 1];
			this.setData({
				lastval: val,
				post: post
			});
		} else if (change == -1) {
			this.postRemove(["countryId", "provinceId", "cityId"]);
			this.setData({
				lastval: val,
				provinces: [],
				provinceIds: [],
				cities: [],
				cityIds: []
			});
		} else if (change == -2) {
			this.postRemove(["cityId"]);
			this.setData({
				lastval: val,
				cities: [],
				cityIds: []
			});
		} else {
			post = this.data.post;
			post.countryId = this.data.countryIds[val[0] - 1];
			post.provinceId = this.data.provinceIds[val[1] - 1];
			post.cityId = this.data.cityIds[val[2] - 1];
			this.setData({
				lastval: val,
				post: post
			});
		}
	},



  /**   
		* 选项卡 3   
		* 
		*/
	layoutChange: function (e) {
		var val = e.currentTarget.dataset.index
		console.log(val)
		var post = this.data.post;
		var postcols = this.data.postCols;
		if (postcols.indexOf("houselayout__bedroomNum") < 0) postcols.push("houselayout__bedroomNum");
		if (postcols.indexOf("houselayout__livingroomNum") < 0) postcols.push("houselayout__livingroomNum");
		if (postcols.indexOf("houselayout__bathroomNum") < 0) postcols.push("houselayout__bathroomNum");
		post.houselayout__bedroomNum = this.data.tabLayoutVals[val][0];
		post.houselayout__livingroomNum = this.data.tabLayoutVals[val][1];
		post.houselayout__bathroomNum = this.data.tabLayoutVals[val][2];
		this.setData({
			layoutItemId: val,
			postCols: postcols,
			post: post
		});
	},
	typeChange: function (e) {
		var val = e.currentTarget.dataset.index;
		console.log(val);
		var post = this.data.post;
		var postcols = this.data.postCols;
		if (postcols.indexOf("houselayout__typeId") < 0) postcols.push("houselayout__typeId");
		post.houselayout__typeId = this.data.tabTypeVals[val];
		this.setData({
			typeItemId: val,
			postCols: postcols,
			post: post
		})
	},
	typeReset: function (e) {
		this.postRemove(["houselayout__bedroomNum", "houselayout__livingroomNum", "houselayout__bathroomNum","houselayout__typeId"]);
		this.setData({
			layoutItemId: -1,      // 默认选中第一个   
			typeItemId: -1
		});
	},
	typeOk: function (e) {
		this.clearModals();
		this.submit();
	},




  /**   
		* 选项卡 4   
		* 
		*/
	compareAverage: function (property, gt) {
		var min = 'min' + property;
		var max = 'max' + property;
		if(gt){
			return function (a, b) {
				var value1 = (a[min] + a[max]) / 2;
				var value2 = (b[min] + b[max]) / 2;
				return value2 - value1;
			}
		} else {
			return function (a, b) {
				var value1 = (a[min] + a[max]) / 2;
				var value2 = (b[min] + b[max]) / 2;
				return value1 - value2;
			}
		}
	},
	orderChange: function (e) {
		var val = e.currentTarget.dataset.index;
		console.log(val);
		
		// ['智能排序','价格降序','价格升序','面积降序','面积升序']
		var list = this.data.list;
		//if (this.data.tabOrders[val] == ''){
		if (val == 0) {
			list.sort(this.compareAverage("Price", false));
		} else if (val == 1) {
			list.sort(this.compareAverage("Price",true));
		} else if (val == 2) {
			list.sort(this.compareAverage("Price",false));
		} else if (val == 3) {
			list.sort(this.compareAverage("Square", true));
		} else if (val == 4) {
			list.sort(this.compareAverage("Square", false));
		}
		this.setData({
			list: list,
			orderItemId: val
		});
		this.clearModals();
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