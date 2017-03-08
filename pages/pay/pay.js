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
    data: {},
    memberFree: {
      data: {},
      onClickFun: '',
      typeVal: '',
      level: '',
      title: '',
      isChecked: {},
    },
    refundFree: {
      data: {},
      onClickFun: '',
      typeVal: '',
      level: '',
      title: '',
      isChecked: {},
    },
    btn2Color: '#279df2',
    fee: 0,
    checked: {
      member_free: '', // 免费时长
      refund_free: '', // 购物减免
    },
    btnList:[],
  },
  pointPay: function(orderno){
    var that = this;
    util.request('POST',{
      url: '/ParkApp/ParkPay/paybyscore',
      data: {
        carno: this.data.carno,
        key_admin: app.key_admin,
        openid: wx.getStorageSync('user').openid,
        orderno,
      }},
      function(result){
        if (result.data.code === 200) {
          if (wx.getStorageSync('localstorage') === '1') {
            wx.setStorageSync(app.key_admin+'park_mycars', [{CarSerialNo:that.data.carno,carimg:that.data.pic}]);
          } else {
            wx.setStorageSync(app.key_admin+'park_mycars',[]);
          }
        } else {
          util.alert({msg:result.data.msg});
        }
      },
      function(error){
        util.alert({msg:error.data.msg});
      });
  },
  pointFun: function(){
    var park = this.data.data;
    var that = this;
    if (this.data.btn2Color === '#279df2') {
      if (park.IntValue === 0) {
        util.alert({msg:'消费金额为0，无需支付！'});
      } else {
        util.request('POST',{
          url: '/ParkApp/ParkPay/cscoreorder',
          data: {
            carno: that.data.carno,
            key_admin: app.key_admin,
            openid: wx.getStorageSync('user').openid,
          }},
          function(result){
            if (result.data.code === 200) {
              that.pointPay(result.data.data.orderNo)
            } else {
              util.alert({msg:result.data.msg});
            }
          },
          function(error){
            util.alert({msg:error.data.msg});
          })
      }
    }
  },
  wxPayDo:function(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success:function(res){
        console.log(res);
      },
      fail:function(res){
        console.log(res);
      }
    });
  },
  wxFun: function(){
    var park = this.data.data;
    var that = this;
    if (park.MoneyValue === 0) {
      util.alert({msg:'消费金额为0，无需支付！'});
    } else {
      var checkeds = this.data.checked;
      util.request('POST',{
          url: '/ParkApp/ParkPay/paybyweixin',
          data: {
            carno: that.data.carno,
            key_admin: app.key_admin,
            openid: wx.getStorageSync('user').openid,
            use_freetime: checkeds.member_free === 'active' ? 1 : 2,
            use_refreetime: checkeds.refund_free === 'active' ? 1 : 2,
          }},
          function(result){
            if (result.data.code === 200) {
              if (result.data.data.total_fee !== 0) {
                that.wxPayDo(result.data.data);
              } else {
                if (wx.getStorageSync('localstorage') === '1') {
                  wx.setStorageSync(app.key_admin+'park_mycars', [{CarSerialNo:that.data.carno,carimg:that.data.pic}]);
                } else {
                  wx.setStorageSync(app.key_admin+'park_mycars',[]);
                }
              }
            } else {
              util.alert({msg:result.data.msg});
            }
          },
          function(error){
            util.alert({msg:error.data.msg});
          });
    }
  },
  checkEnoughPoint:function(park) {
    if (park.bonus >= park.IntValue) {
      this.setData({
        btn2Color: '#279df2',
      });
    } else {
      this.setData({
        btn2Color: '',
      });
    }
  },
  checkChecked: function(checked) {
    var park = this.data.data;
    let btn2Color = this.data.btn2Color;
    let num = 0;
    let fee = 0;
    for (const item in checked) {
      if (checked[item] === 'active') {
        num ++;
        fee += this.data.data[item].free_money;
      }
    }
    if (num === 0) {
      btn2Color = '#279df2';
    } else {
      btn2Color = '';
    }

    if (park.bonus < park.IntValue) {
      btn2Color = '';
    }

    this.setData({
      btn2Color,
      fee,
    });
  },
  clickFun:function(e){
    var dataType = e.currentTarget.dataset.type;
    if (dataType === 'member_free') {
      this.setData({
        checked: {
          member_free: this.data.checked[dataType] === 'active' ? '' : 'active',
          refund_free: this.data.checked.refund_free,
        }
      });
    } else {
      this.setData({
        checked: {
          member_free: this.data.checked.member_free,
          refund_free: this.data.checked[dataType] === 'active' ? '' : 'active',
        }
      });
    }
    this.loadFreeFun(this.data.data);
    this.checkChecked(this.data.checked);
    this.loadBtnsFun(this.data.data);
  }, 
  loadFreeFun:function(park){
    this.setData({
      memberFree: {
        data: park.member_free ? park.member_free : {},
        onClickFun: 'changeFreeFun',
        typeVal: 'member_free',
        level: park.level,
        title: '会员减免',
        isChecked: this.data.checked,
      },
      refundFree: {
        data: park.refund_free ? park.refund_free : {},
        onClickFun: 'changeFreeFun',
        typeVal: 'refund_free',
        title: '购物减免',
        isChecked: this.data.checked,
      }
    });
  },
  loadBtnsFun:function(park){
    if (park.MoneyValue !== 0 && !park.MoneyValue) {
      return false;
    }

    var btns = [{
      id: 2,
      btnName: '积分支付' + park.IntValue + '分',
      btnFun: 'pointFun',
      style: 'background-color:'+this.data.btn2Color,
    }, {
      id: 1,
      btnName: '',
      btnFun: 'wxFun',
    }];

    if (park.is_scorepay === '1') {
      btns[1].btnName = '微信支付' + (park.MoneyValue - this.data.fee <= 0 ?
        0 : (park.MoneyValue - this.data.fee).toFixed(2)) + '元';
    } else {
      btns = [{
        id: 1,
        btnName: '',
        btnFun: 'wxFun',
      }];
      btns[0].btnName = '微信支付' + (park.MoneyValue - this.data.fee <= 0 ?
        0 : (park.MoneyValue - this.data.fee).toFixed(2)) + '元';
    }

    this.setData({
      btnList: btns,
    });
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      date: {
        pic: options.pic,
        year: new Date().nowdate().year,
        month: new Date().nowdate().month,
        date: new Date().nowdate().date,
        day: new Date().nowdate().day
      },
      carno: options.carno,
      pic: options.pic
    });
    util.request('POST',{
      url: '/ParkApp/ParkPay/choosecar',
      data: {
        carno: options.carno,
        key_admin: app.key_admin,
        openid: wx.getStorageSync('user').openid,
      }},
      function(result){
        if (result.data.code === 200) {
          var da = result.data.data;
          da.park_time = util.translateTime(da.park_time);
          that.setData({
            data: da,
          });
          that.loadFreeFun(da);
          that.loadBtnsFun(da);
          that.checkEnoughPoint(da);
        } else {
          util.alert({msg:result.data.msg});
        }
      },
      function(error){
        util.alert({msg:error.data.msg});
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