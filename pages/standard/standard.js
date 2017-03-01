// pages/standard/standard.js
var util = require('../../utils/util.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    article_content: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    util.request('POST',{
      url: '/ParkApp/ParkPay/getParkIntro',
      data: {
        key_admin: app.key_admin
      }},
      function(result){
        if (result.data.code === 200) {
          that.setData({
            article_content:WxParse.wxParse('article_content', 'html', result.data.data.function_name, that, 5)
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