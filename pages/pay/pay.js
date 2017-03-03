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
      member_free: 'active', // 免费时长
      refund_free: 'active', // 购物减免
    },
    btnList:[],
  },
  pointFun: function(){
    console.log('积分');
  },
  wxFun: function(){
    console.log('微信');
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
    this.checkEnoughPoint(this.data.data);
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
      }
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
          that.setData({
            data: result.data.data,
          });
          that.loadFreeFun(result.data.data);
          that.loadBtnsFun(result.data.data);
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
    this.checkEnoughPoint(this.data.data);
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})