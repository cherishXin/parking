var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    page: 1,
    list: [],
    isData: true,
  },
  pageFun:function() {
    var pageVal = this.data.page + 1;
    this.setData({
      page: pageVal,
    });
    this.getData();
  },
  getData:function() {
    var that = this;
    util.request('POST',{
      url: '/ParkApp/ParkPay/getParkOrderLists',
      data: {
        page: that.data.page,
        key_admin: app.key_admin,
        openid: wx.getStorageSync('user').openid,
      }},
      function(result){
        if (result.data.code === 200) {
          var isData = result.data.data.length < 10 ? false : true;
          that.setData({
            isData: isData,
            list: that.data.list.concat(result.data.data),
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
    this.getData();
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