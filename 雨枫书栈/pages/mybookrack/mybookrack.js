// pages/mybookrack/mybookrack.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookrack:[],
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
    this.getmybookrack();
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
      bookrack: [],
      page: 1
    })
    this.getmybookrack();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getmybookrack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 获取的我的书架
   */
  getmybookrack:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this = this;
    var page = _this.data.page;
    var bookrack = _this.data.bookrack;
    var openid = wx.getStorageSync('openid');
    var data = {
      page: page,
      openid: openid
    };
    wx.request({
      url: api.book_box,
      method: 'POST',
      dataType: 'json',
      data:data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            bookrack.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            bookrack: bookrack,
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
  /**
   * 跳转图书详情
   */
  openbookcontent:function(e){
    var isbn = e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: '../book_content/book_content?isbn='+isbn,
    })
  }
})