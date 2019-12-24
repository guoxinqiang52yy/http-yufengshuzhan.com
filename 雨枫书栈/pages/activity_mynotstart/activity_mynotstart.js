// pages/activity_mynotstart/activity_mynotstart.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act_data:''
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
    this.getdata();
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
   * 获取数据
   */
  getdata: function () {
    var _this = this;
    var act_data = _this.data.act_data;
    var openid = wx.getStorageSync('openid');
    var data = {
      openid: openid,
      type: 4
    }
    wx.request({
      url: api.my_pub,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data);
        _this.setData({
          act_data: res.data.data
        })
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
  /**
   * 跳转活动详情
   */
  openActivityContent: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity_content/activity_content?id=' + id,
    })
  }
})