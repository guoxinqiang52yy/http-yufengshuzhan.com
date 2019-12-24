// pages/activity_collect/activity_collect.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act_data:[],
    page:1
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
    this.setData({
      my_borrow: [],
      page: 1
    })
    this.getdata();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getdata()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取活动收藏
   */
  getdata:function(){
    var _this=this;
    var act_data=_this.data.act_data;
    var page=_this.data.page;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: api.act_colact,
      method: 'POST',
      dataType: 'json',
      data: {
        openid:openid,
        page:page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            act_data.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            act_data: act_data,
            page: page
          })
        } else {
          wx.hideToast();
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
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
  openactivity:function(e){
    var _this=this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity_content/activity_content?id='+id,
    })
  }
})