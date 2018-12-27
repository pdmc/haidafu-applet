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
	let reg = new RegExp('/^1\d{10}$/');
	if (reg.test(mobile)) {
		return true
	} else {
		return false
	}
};

module.exports = {
  formatTime: formatTime,
	array_find_obj: array_find_obj,
	checkMobile: checkMobile
}
