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
  wx.showToast({
    title: 'loading',
    icon: 'loading'
  });
	wx.request({
		url : urlHttp + para.url,
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
      wx.hideToast();
      if(complete) complete(res);
    }
	}); 
}

function translateTime(timestamp){
  let time = `${parseInt(timestamp, 10)}秒`;
  if (parseInt(timestamp, 10) > 60) {
    const second = parseInt(timestamp, 10) % 60;
    let min = parseInt(timestamp / 60, 10);
    time = `${min}分${second}秒`;
    if (min > 60) {
      min = parseInt(timestamp / 60, 10) % 60;
      let hour = parseInt(parseInt(timestamp / 60, 10) / 60, 10);
      time = `${hour}小时${min}分${second}秒`;
      if (hour > 24) {
        hour = parseInt(parseInt(timestamp / 60, 10) / 60, 10) % 24;
        const day = parseInt(parseInt(parseInt(timestamp / 60, 10) / 60, 10) / 24, 10);
        time = `${day}天${hour}小时${min}分${second}秒`;
      }
    }
  }
  return time;
};

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

function alert(data){
  wx.showModal({
    title: data.title ? data.title : '错误提示',
    content: data.msg,
    showCancel: false,
    confirmText: "确定"
  });
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    // 'S': this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
}

module.exports = {
  formatTime: formatTime,
  request: request,
  translateTime: translateTime,
  alert:alert
}
