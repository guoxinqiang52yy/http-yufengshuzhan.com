// pages/change_sign/change_sign.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync("openid");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    des:"", 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.des!="null") {
      var des = options.des;
      this.setData({
        des: des
      })
    } else if(options.des=="null"){
      this.setData({
        des: ''
      })
    }
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
    this.postdes()
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
   * 个性签名改变事件
   */
  changedes: function (e) {
    this.setData({
      des: e.detail.value
    })
  },
  /**
   * 提交个性签名
   */
  postdes:function(){
    var des = this.data.des;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_info_edit,
      method: 'POST',
      dataType: 'json',
      data: {
        des: des,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '修改成功',
          })
          wx.redirectTo({
            url: '../mydata/mydata'
          })
        } else {
          wx.showToast({
            title: '修改失败',
          })
          return false;
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