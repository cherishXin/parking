var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    date: {
      year: '',
      month: '',
      date: '',
      day: '',
      pic:''
    },
    list: [],
    carno: ''
  },
  // bindKeyInput: function() {

  // },
  onSelect:function(e) {
    var car = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../pay/pay?carno='+car.carno+'&pic='+car.pic,
    });
  },
  setcarnFun: function(e) {
    this.setData({
      carno: e.detail.value
    });
  },
  checkFun:function() {
    var that = this;
    if (!that.data.carno) {
      util.alert({msg:"车牌号不能为空！"});
      return false;
    }
    util.request('POST',{
      url: '/ParkApp/ParkPay/searchcar',
      data: {
        carno: that.data.carno,
        key_admin: app.key_admin
      }},
      function(result){
        if (result.data.code === 200) {
          that.setData({
            list: result.data.data,
          });
        } else {
          util.alert({msg:result.data.msg});
        }
      },
      function(error){
        util.alert({msg:error.data.msg});
      })
  },
  onLoad:function(options){
    var that = this
    that.setData({
      date: {
        pic: options.pic,
        year: new Date().nowdate().year,
        month: new Date().nowdate().month,
        date: new Date().nowdate().date,
        day: new Date().nowdate().day
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})