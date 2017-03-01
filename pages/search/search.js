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
    var carno = e.currentTarget.dataset.carno;
    wx.navigateTo({
      url: '../pay/pay?carno='+carno,
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
      wx.showModal({
        title: '错误提示',
        content: "车牌号不能为空！"
      });
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
          wx.showModal({
            title: '错误提示',
            content: result.data.msg,
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
          })
        }
      },
      function(error){
        wx.showModal({
            title: '错误提示',
            content: error.data.msg,
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
          })
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