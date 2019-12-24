// pages/bestsellers/bestsellers.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list_hot:[],
    search_value:'',
    page: 1,
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
    var _this=this;
    _this.getbestsellers();
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
      page:1,
      book_list_hot: []
    })
    this.getbestsellers(); 
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getbestsellers();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 跳转图书简介
   */
  openbookcontent: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../booklist_content/booklist_content?id='+id
    })
  },
  /**
   * 获取畅销书单
   */
  getbestsellers: function () {
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this = this;
    var page = _this.data.page;
    var book_list_hot = _this.data.book_list_hot;
    var data = {
      page: page,
      type: 1
    };
    wx.request({
      url: api.chang_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            book_list_hot.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            book_list_hot: book_list_hot,
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
   * 同步改变搜索内容
   */
  changesearchvalue: function (event) {
    console.log(event);
    var value = event.detail.value;
    this.setData({
      search_value: value
    })
  },
  /**
   * 搜索书名/作者
   */
  searchSubmit: function (event) {
    var value = this.data.search_value;
    if (value == "") {
      wx.showModal({
        title: '请输入书名或作者',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      wx.navigateTo({
        url: '../booklist_content/booklist_content?value=' + value,
      })
    }
  },
  /**
   * 点击扫码
   */
  saoma: function () {
    var openid = wx.getStorageSync('openid');
    var _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function (res) {
        console.log(res);
        //条形码 书角借书
        if (res.scanType == "EAN_13") {
          var isbn = res.result;
          wx.navigateTo({
            url: '../book_content/book_content?isbn=' + isbn + '&is_bookcase=1',
          })
        } else if (res.scanType == "QR_CODE") {
          //二维码 书柜借书
          var order_number = res.result
          //console.log('01' + data);
          _public.postorder(openid, order_number, _public.postordercallback);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})