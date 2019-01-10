const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const array_find_obj = function (array, key, value) {
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

const checkMobile =  function (mobile) {
	let reg = new RegExp(/^1\d{10}$/);
	if (reg.test(mobile)) {
		return true
	} else {
		return false
	}
};

const myStorageFind = function (key, key2, value2) {
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

const myStorageDel = function () {
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

if  (!Array.indexOf)  {
	    Array.prototype.indexOf  =  function  (obj)  {
		        for  (var  i  =  0;  i  <  this.length;  i++)  {
			            if  (this[i]  ==  obj)  {
				                return  i;
			            }
		        }
		        return  -1;
	    }
}

module.exports = {
  formatTime: formatTime,
	array_find_obj: array_find_obj,
	myStorageFind: myStorageFind,
	myStorageDel: myStorageDel,
	checkMobile: checkMobile
}
