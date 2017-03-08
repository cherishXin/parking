//index.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    tapList: [{
        url: 'search/search',
        clas: 'icon-jiaofei',
        text: '缴费',
      },
      // {
      //   url: '',
      //   clas: 'icon-parking',
      //   text: '停车',
      // },
      // {
      //   url: '',
      //   clas: 'icon-iconfont18zhaoche2',
      //   text: '寻车',
      // },
      {
        url: 'records/records',
        clas: 'icon-fapiao',
        text: '缴费记录',
      }],
    list: [],
    logo: '',
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goLink: function(event) {
    var toUrl = event.currentTarget.dataset.url;
    if (toUrl === 'search/search') { 
      wx.navigateTo({
        url: '../'+toUrl+'?key_admin='+app.key_admin+'&pic='+this.data.logo,
      });
    } else if (toUrl) {
      wx.navigateTo({
        url: '../'+toUrl+'?key_admin='+app.key_admin
      });
    }
  },
  onLoad: function () {
    // console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    var that = this
    util.request('POST',{
      url: '/ParkApp/ParkPay/getfreeparking',
      data: {
        key_admin: app.key_admin
      }},
      function(result){
        if (result.data.code === 200) {
          wx.setStorageSync('localstorage', result.data.localstorage);
          that.setData({
            logo: result.data.logo,
            list: result.data.data,
          });
        } else {
          util.alert({msg:result.data.msg});
        }
      },
      function(error){
        util.alert({msg:error.data.msg});
      })
  }
})
