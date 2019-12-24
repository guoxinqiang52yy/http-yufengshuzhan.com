// pages/not_pay/not_pay.js
var api = require('../../utils/apiconfig.js');
var openid=wx.getStorageSync('openid');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number:'',
    title:'',
    name:'',
    price:'',
    time:'',
    balance_hidden:true,
    balance_value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_number: options.order_number
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getnotpay();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取未支付订单信息
   */
  getnotpay:function(){
    wx.showToast({
      title: '正在加载',
      icon:'loading'
    })
    var _this=this;
    var order_number = _this.data.order_number;
    var openid = wx.getStorageSync('openid');
    var data={
      openid:openid,
      order_number: order_number
    }
    console.log(data)
    wx.request({
      url: api.pay_order,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if(res.data.code==1){
          var title='还书确认'
        } else if (res.data.code == 2){
          var title = '买书确认'
        }
        _this.setData({
          title:title,
          name: res.data.data.book_name,
          price: res.data.data.price,
          time: res.data.data.time,
        })
      },
      fail(res) {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 确认支付未完成订单
   */
  affirmnotpay:function(){
    wx.showToast({
      title: '正在支付',
      icon: 'loading'
    })
    var _this = this;
    var order_number = _this.data.order_number;
    var openid = wx.getStorageSync('openid');
    var data = {
      openid: openid,
      order_number: order_number
    }
    wx.request({
      url: api.pay_order_do,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: '支付成功',
            icon:'success'
          })
          wx.redirectTo({
            url: '../home/home',
          })
        } else if (res.data.code == 0) {
          wx.showModal({
            title: '余额不足',
            content: '请充值后进行支付',
            success(res){
              if (res.confirm == true) {
                //调用充值
                _this.balancehidden();
              }
            }
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 充值余额显示
   */
  balancehidden: function () {
    this.setData({
      balance_hidden: false
    })
  },
  /**
   * 改变充值金额
   */
  changebalance: function (e) {
    var balance_value = e.detail.value;
    this.setData({
      balance_value: balance_value
    })
  },
  /**
   * 确认充值余额
   */
  paybalance: function () {
    var _this = this;
    var openid = wx.getStorageSync('openid');
    var data = {
      openid: _this.data.openid,
      money: _this.data.balance_value,
      type: 3
    }
    wx.request({
      url: api.pay_money,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data);
        var data = res.data;
        _this.setData({
          balance_hidden: true
        })
        _public.requestPayment(data, 1, _this.paycallback);
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  paycallback:function(){
    wx.showToast({
      title: '充值成功',
    })
  },
  /**
   * 取消充值
   */
  payhidden: function () {
    this.setData({
      balance_hidden: true
    })
  }
})