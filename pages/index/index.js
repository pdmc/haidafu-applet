Page({
  data: {
    imgUrls: [
      'http://image.pk4yo.com/tooopen_sy_143912755726.jpg',
      'http://image.pk4yo.com/tooopen_sy_175866434296.jpg',
      'http://image.pk4yo.com/tooopen_sy_175833047715.jpg'
    ],
    search_img: '../../static/images/search_button.png',
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    indicatorDots2: false,
    previousMargin2: 0,
    nextMargin2: '50rpx',
    state: 0,
    _num: '0',
    list: [], // 数据列表
    select_list: [[]], // 精选房源列表，按照城市索引排列，关联__num
    cities: [], // 精选房源城市列表
    loading: true // 显示等待框
  },
  onLoad: function(options) {
    const _this = this;
    // 拼接请求url
    const url = 'https://zhuabo.pk4yo.com/projects/getbycond?select=1';
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
        if(res.data == undefined){
          return;
        }
        // 赋值
        _this.setData({
          list: res.data.data,
          loading: false // 关闭等待框
        });
        for (var index in res.data.data) {
          //_this.cities[__this.cities.length] = res.data[index].area__cityId__name;
          var cts = _this.data.cities;
          var hit = false;
          var found = cts.findIndex(function(value, idx, arr) {
            if (value.indexOf(res.data.data[index].area__cityId__name) == 0 && value.length == res.data.data[index].area__cityId__name.length){  // 城市相同
              var slist = _this.data.select_list;
              if (slist[idx] == undefined) {
                slist[idx] = [];
              }
              slist[idx].push(res.data.data[index]);
              _this.setData({
                select_list: slist
              });
              hit = true;
            }
            return hit;
            //return value.indexOf(res.data.data[index].area__cityId__name) == 0 && value.length == res.data.data[index].area__cityId__name.length; // lowb判断字符串相同 
          });
          if (found == -1 && cts.length < 4) {
            var idx = cts.push(res.data.data[index].area__cityId__name) - 1;
            var slist = _this.data.select_list;
            if (slist[idx] == undefined) {
              slist[idx] = [];
            }
            slist[idx].push(res.data.data[index]);
            _this.setData({
              select_list: slist,
              cities: cts
            });
          }
          //cities: _this.data.cities.push(res.data.data[index].area__cityId__name)
        }
      }
    })
  },
  // 按预算，选好房
  bindViewTap: function() {
    wx.navigateTo({
      url: '../projectlist/projectlist'
    })
  },
  changeProperty: function(e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  toggle: function(e) {
    console.log(e.currentTarget.dataset.index);
    if (this.data._num === e.currentTarget.dataset.index) {
      return false;
    } else {
      this.setData({
        _num: e.currentTarget.dataset.index
      })
    }
  },
  bindChange: function(e) {
    var that = this;
    console.log(e)
    /*that.setData({
      _num: e.detail.current
    });
    switch (e.detail.current) {
      case 0:
        that.data.state = 0
        break;
      case 1:
        that.data.state = 1
        break;
      case 2:
        that.data.state = 2
        break;
    }*/
    // wx.request({
    //   url: app.baseURL + 'act=member_invoice&op=mycomposegroup',
    //   data: {
    //     appid: app.appid,
    //     pagenums: "1",
    //     member_id: app.member_id,
    //     state: that.data.state
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     app.allorders = res.data.datas.goods
    //     that.setData({
    //       list: res.data.datas.goods,
    //       height: res.data.datas.goods.length * 215
    //     })
    //   }
    // })
  }
})