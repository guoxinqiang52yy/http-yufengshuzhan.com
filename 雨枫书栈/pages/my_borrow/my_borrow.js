// pages/my_borrow/my_borrow.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync("openid");
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    return_hidden:true,
    my_borrow:[],
    page:1,
    return_scon:1,
    return_number:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //书柜还书第二次扫码
    if (options.return_scon==2){
      this.setData({
        return_scon:2
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getmyborrow();
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
    this.getmyborrow();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getmyborrow();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 还书显示
   */
  returnhidden: function (e) {
    var _this = this;
    var order_number = e.currentTarget.dataset.order_number;
    var return_scon = _this.data.return_scon;
    var openid = wx.getStorageSync('openid');
    if (return_scon==1){
      this.setData({
        return_hidden: false,
        return_number: order_number
      })
    } else if (return_scon==2){
      wx.scanCode({
        onlyFromCamera: true,
        scanType: [],
        success: function (res) {
          var back_order=res.result;
          var data={
            openid:openid,
            order_number:order_number,
            back_order:back_order
          }
          wx.request({
            url: api.back_pad_one,
            method: 'POST',
            dataType: 'json',
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // form-data提交
            },
            success(res) {
              if(res.data.code==1){
                wx.navigateTo({
                  url: '../affirm_return/affirm_return?back_order=' + back_order + '&num=0',
                })
              }else{
                wx.showModal({
                  title: '还书订单生成失败'
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
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  /**
   * 获取我的借书
   */
  getmyborrow:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var openid = wx.getStorageSync('openid');
    var _this = this;
    var page = _this.data.page;
    var my_borrow = _this.data.my_borrow;
    console.log(openid)
    var data = {
      page: page,
      openid: openid
    };
    wx.request({
      url: api.user_my_borrow,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            my_borrow.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            my_borrow: my_borrow,
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
   * 借转买
   */
  buybook:function(e){
    var _this=this;
    var order_number = e.currentTarget.dataset.order_number;
    _public.borrowtobuy(openid,order_number,_public.borrowbuydo)
  },
  /**
   * 还书 区分书柜还书 书角还书
   */
  returnbook:function(e){
    var _this=this;
    var num=e.currentTarget.dataset.num;
    var order_number = _this.data.return_number;
    wx.redirectTo({
      url: '../nearbybookcase/nearbybookcase?num=' + num + '&bookhide=2&order_number=' + order_number,
    })
  },
  /**
   * 跳转图书详情
   */
  openbookcontent:function(e){
    var isbn=e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: '../book_content/book_content?isbn='+isbn,
    })
  },
  /**
   * 取消还书
   */
  cancelReturn:function(){
    this.setData({
      return_hidden:true
    })
  }
})