// pages/affirm_buy/affirm_buy.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number:'',
    name:'',
    price:'',
    time:'',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order_number = options.order_number;
    var name=options.book_name;
    var price=options.price;
    var time=options.time;
    var is_bookcase=options.is_bookcase;
    this.setData({
      order_number: order_number,
      name: name,
      price:price,
      time:time,
      is_bookcase: is_bookcase,
      openid: wx.getStorageSync('openid')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getBuyDetail
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
   * 获取买书订单详情
   */
  getBuyDetail:function(){
    var _this=this;
    var order_number = _this.order_number;
    wx.request({
      url: api.chang_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          name:res.data.data.book_name,
          order_number:res.data.data.order_number,
          price:res.data.data.price,
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
   * 确认买书
   */
  affirmbuy:function(){
    var _this=this;
    var order_number = _this.data.order_number;
    var openid = _this.data.openid;
    var is_bookcase = _this.data.is_bookcase;
    if (is_bookcase==0){
      var url = api.to_buy_do
    } else if (is_bookcase==1){
      var url = api.buy_pad_return
    }
    console.log(order_number);
    wx.request({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: {
        openid:openid,
        order_number: order_number
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if(res.data.code==0){
          wx.showModal({
            title: '余额不足',
            content: '请充值余额后购买',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../member/member',
                })
              }
            }
          })
        }else if(res.data.code==1){
          wx.showModal({
            title: '购买成功',
            showCancel:false,
            success(res){
              if(res.confirm==true){
                wx.reLaunch({
                  url: '../home/home',
                })
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
  /**
   * 取消
   */
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  }
})