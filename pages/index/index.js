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
    nextMargin: 0
  },
  // 按预算，选好房
  bindViewTap: function () {
    wx.navigateTo({
      url: '../projectlist/projectlist'
    })
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})