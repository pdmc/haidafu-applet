const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

function randomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range);
	return num;
}

var requestTask = '';
function makeRequest(thisObj, reqUrl, data, successCallback, method) {
	var self = thisObj;
	self.setData({
		loading: true
	})
	wx.showLoading({ "title": "数据加载中..." });
	if (typeof requestTask == 'object') {
		requestTask.abort() // 取消上次请求任务
	}
	requestTask = wx.request({
		url: reqUrl,
		method: method || 'POST',
		data: data || {},

		success: function (result) {
			wx.hideLoading();
			self.setData({
				loading: false
			})
			if (result.statusCode == 200) {
				successCallback && successCallback(result.data);
			} else {
				wx.showToast({
					title: '网络请求失败！',
					icon: 'none',
					duration: 2000
				})
			}
		},

		fail: function ({ errMsg }) {
			console.log('request fail', errMsg)
			wx.hideLoading();
			self.setData({
				loading: false
			})
		}
	})
}

const array_find_obj = function(array, key, value) {
  var index = -1;
  for (let i = 0; i < array.length; i++) {
    //console.log(resultSet[i])
    if (value == array[i][key]) {
      index = i;
      return index;
    }
  }
  return index;
};

const checkMobile = function(mobile) {
  let reg = new RegExp(/^1\d{10}$/);
  if (reg.test(mobile)) {
    return true
  } else {
    return false
  }
};

const myStorageFind = function(key, key2, value2) {
  //const key = 'myfavorites';
  var favs = wx.getStorageSync(key);
  if (favs.length == 0) {
    console.log("Info: my storage empty!!!");
    return;
  }
  //var pid = this.data.project.pId;
  var fi = array_find_obj(favs, key2, value2);
  return fi;

};

const myStorageDel = function() {
  //const key = 'myfavorites';
  var favs = wx.getStorageSync(key);
  if (favs.length == 0) {
    console.log("Info: my storage empty!!!");
    return;
  }
  //var pid = this.data.project.pId;
  var fi = array_find_obj(favs, key2, value2);
  //console.log(fi);
  favs.splice(fi, 1);
  wx.setStorage({
    key: key,
    data: favs
  });

};

if  (!Array.indexOf)  {    
  Array.prototype.indexOf  =   function (obj)  {        
    for  (var  i  =  0;  i  <  this.length;  i++)  {            
      if  (this[i]  ==  obj)  {                
        return  i;            
      }        
    }        
    return  -1;    
  }
}

module.exports = {
  formatTime: formatTime,
	randomNum: randomNum,
	makeRequest: makeRequest,
  array_find_obj: array_find_obj,
  myStorageFind: myStorageFind,
  myStorageDel: myStorageDel,
  checkMobile: checkMobile
}