//app.js
App({
  onLaunch: function () {
    var that = this;
    var user = wx.getStorageSync('user') || {};    
    var userInfo = wx.getStorageSync('userInfo') || {}; 
    if((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)){   
      wx.login({
        success: function(res){
          if (res.code) {
            wx.getUserInfo({
              success: function(infoRes){
                wx.setStorageSync('userInfo', infoRes.userInfo);
              }
            });
            var para = that.globalData;
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: para.appid,
                secret: para.secret,
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              method: 'POST',
              header: {
                "Content-Type":"application/x-www-form-urlencoded"
              },            
              success: function(requestRes){
                var user={};  
                // user.openid = 'oq1Gkt1cOWRhX1RUYl23E1uIBXkI';
                user.openid = requestRes.data.openid;               
                user.expires_in = Date.now() + requestRes.data.expires_in * 1000; 
                wx.setStorageSync('user', user);
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg) 
          }
        }
      });
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    appid:'wxbcf7a3474c5b35d2',
    secret:'2014e3317bab3cad51d740602856fabe',
  },
  key_admin: '202cb962ac59075b964b07152d234b70'
}) 