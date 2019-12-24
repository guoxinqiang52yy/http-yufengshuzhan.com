// pages/mydata/mydata.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync("openid");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_data:'',
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
    this.getuserdata();
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
   * 跳转更改性别
   */
  openchangesex:function(e){
    var sex = this.data.user_data.sex;
    wx.navigateTo({
      url: '../change_sex/change_sex?sex='+sex,
    })
  },
  /**
   * 跳转更改地区
   */
  openchangeregoin: function (e) {
    var regoin = this.data.user_data.region;
    wx.navigateTo({
      url: '../change_regoin/change_regoin?regoin='+regoin,
    })
  },
  /**
   * 跳转更改个性签名
   */
  openchangesign: function (e) {
    var des = this.data.user_data.des;
    wx.navigateTo({
      url: '../change_sign/change_sign?des='+des,
    })
  },
  /**
   * 跳转更改昵称
   */
  openchangenickname:function(e){
    var name = this.data.user_data.name;
    wx.navigateTo({
      url: '../change_nickname/change_nickname?name='+name,
    })
  },
  /**
   * 获取用户个人资料
   */
  getuserdata:function(){
    var _this=this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_info,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        var name = res.data.data.name;
        name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
        name = name.replace(/\"/g, "");
        res.data.data.name = name;
        _this.setData({
          user_data: res.data.data
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