// pages/affirm_borrow/affirm_borrow.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    back_order:'',
    price:'',
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        name: options.name,
        back_order: options.back_order,
        price: options.price,
        time:options.time
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 确认信息后返回首页
   */
  affirmborrow:function(){
    var _this=this;
    var order_number=_this.data.back_order;
    var openid = wx.getStorageSync('openid');
    var data={
      openid:openid,
      order_number: order_number
    }
    wx.request({
      url: api.borrow_do,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if(res.data.code==1){
          wx.showModal({
            title: '借书成功',
            showCancel: false,
            success(res) {
              if (res.confirm == true) {
                wx.reLaunch({
                  url: '../home/home'
                })
              }
            }
          })
        }else if(res.data.code==3){
          wx.showModal({
            title: '您未交押金',
            content: '请支付押金',
            showCancel:false,
            success(res){
              wx.navigateTo({
                url: '../member/member',
              })
            }
          })
        } else if (res.data.code == 4) {
          wx.showModal({
            title: '借书已达上限',
            content: '请在我的还书中进行还书',
            success(res) {
              if (res.confirm == true) {
                //跳转我的借书
                wx.navigateTo({
                  url: '../my_borrow/my_borrow',
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: '借书失败',
            showCancel:false
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
  // /**
  //  * 获取订单信息
  //  */
  // getborrowdetail:function(){

  // }
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  }
})