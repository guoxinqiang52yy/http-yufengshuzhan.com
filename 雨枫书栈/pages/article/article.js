// pages/article/article.js
var api = require('../../utils/apiconfig.js');
var wxParse = require('../../wxParse/wxParse.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position:'',
    id:'',
    detail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      position:options.position,
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getarticle();
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
   * 获取文章信息
   */
  getarticle:function(){
    var _this=this;
    var data={
      id:_this.data.id,
      position:_this.data.position
    }
    wx.request({
      url: api.banner_detail,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        // res.data.data = app.convertHtmlToText(res.data.data);
        console.log(res.data.data);
        wxParse.wxParse('detail', 'html', res.data.data, _this, 0);
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