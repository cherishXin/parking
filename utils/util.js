function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(method,para,success,error,complete){	
  var urlHttp = 'https://o2o.rtmap.com/o2oPark';
  var urlTest = 'https://wumai.rtmap.com/o2oPark';
	wx.request({
		url : urlTest + para.url,
		method: method,	
		data : para.data,
    header: {
      "Content-Type":"application/x-www-form-urlencoded"
    },
		success : function(res) {
      if(success) success(res);
		},
    fail:function(res){
      if(error) error(res);
    },
    complete: function(res) {
      console.log(res);
      if(complete) complete(res);
    }
	}); 
}

Date.prototype.nowdate = function () {
  // const addZero = (data) => {data < 10 ? `'0' + ${data}` : data;};
  const addZero = data => (data < 10 ? `0${data}` : data);
  const dateArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const _date = new Date();
  const _year = _date.getFullYear();
  const _month = _date.getMonth() + 1;
  const _da = _date.getDate();
  const _day = _date.getDay();
  return {
    year: addZero(_year),
    month: addZero(_month),
    date: addZero(_da),
    day: dateArr[_day],
  };
};

module.exports = {
  formatTime: formatTime,
  request: request
}
