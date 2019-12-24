// pages/activity_sign/activity_sign.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    id:'',
    sign_data:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getsigndetail()
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
  chanegname:function(e){
    var name = e.detail.value;
    this.setData({
      name:name
    })
  },
  chanegphone:function(e){
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  /**
   * 获取签到相关信息
   */
  getsigndetail:function(){
    var _this=this;
    var id=_this.data.id;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: api.act_sign,
      method: 'POST',
      dataType: 'json',
      data: {
        act_id: id,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          sign_data: res.data.data
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
   * 签到
   */
  signdo:function(e){
    var _this = this;
    var act_id = e.currentTarget.dataset.id;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.sign_do,
      method: 'POST',
      dataType: 'json',
      data: {
        act_id: act_id,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if(res.data.code==1){
          wx.showToast({
            title: '签到成功',
          })
          wx.redirectTo({
            url: '../home/home',
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
  }
})