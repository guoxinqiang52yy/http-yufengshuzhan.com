// pages/change_nickname/change_nickname.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:"", 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name){
      var name = options.name;
      this.setData({
        nickname:name
      })
    }else{
      this.setData({
        nickname: ''
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
    this.postname()
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
   * 修改昵称
   */
  postname:function(){
    var name=this.data.nickname;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_info_edit,
      method: 'POST',
      dataType: 'json',
      data: {
        name: name,
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(res.data.msg=='success'){
          wx.showToast({
            title: '修改成功',
          })
          wx.redirectTo({
            url:'../mydata/mydata'
          })
        }else{
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
  },
  /**
   * 昵称改变事件
   */
  changename:function(e){
    this.setData({
      nickname:e.detail.value
    })
  }
})