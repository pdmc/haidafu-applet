// pages/projectlist/projectlist.js
var cityData = require('../../utils/city.js');
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
    _num: -1,
    _res: 0,

    isShow: true,
    currentTab: 0,

    // ---- 遮罩层 ---
    openPicker: false,
    needAnimation: false,
    contentHeight: 1000,
    itemId: 0,      // 默认选中第一个   


    //选择的终点城市暂存数据
    endselect: "",
    //终点缓存的五个城市
    endcitys: [],
    //用户选择省份之后对应的城市和县城
    endkeys: {},
    //用户选择县城
    town: [],
    //所有车长
    commanders: cityData.getcommanders(),
    //所有车型
    models: cityData.getmodels(),
    //选中的车长
    commander: "",
    //选中的车型
    model: "",
    displaycity: 0,
    city: "起点",
    city1: "目的地",
    //车型
    model: "车长车型",
    qyopen: false,
    qyshow: true,
    nzopen: false,
    pxopen: false,
    nzshow: true,
    pxshow: true,
    isfull: false,
    cityleft: cityData.getCity(),
    citycenter: {},
    cityright: {},
    select1: '',
    select2: '',
    select3: '',
    shownavindex: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
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
    })
  },


  //选择起点
  listqy: function (e) {
    this.setData({
      openPicker: !this.data.openPicker,
      needAnimation: true
    });
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  //目的地选择终点
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.nv,
        nzopen: true,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  //选择车型
  listpx: function (e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },
  hidebg: function (e) {

    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },





  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
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
  bindChange: function (e) {
    var that = this;
    console.log(e);
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