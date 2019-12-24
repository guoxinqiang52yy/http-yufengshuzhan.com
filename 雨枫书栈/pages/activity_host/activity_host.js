// pages/activity_host/activity_host.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act_url:'',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var openid = wx.getStorageSync('openid');
    this.setData({
      openid:openid
    })
    this.getacturl();
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
   * 获取发起活动后台地址
   */
  getacturl:function(){
    var _this=this;
    var openid=_this.data.openid;
    var data={
      openid:openid
    }
    wx.request({
      url: api.act_fabu,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        _this.setData({
          act_url:res.data.data
      })
      },
      fail(res) {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  }
})