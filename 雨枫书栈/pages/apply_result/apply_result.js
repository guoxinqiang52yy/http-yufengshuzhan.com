// pages/apply_result/apply_result.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_result:true,
    id:'',
    apply_data:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.result == 'true') {
      this.setData({
        apply_result: true,
        id:options.id
      })      
    }else{
      this.setData({
        apply_result: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.apply_result==true){
      this.getinfo();
    }
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
   * 获取报名资料
   */
  getinfo:function(){
    var _this=this;
    var id=_this.data.id;
    var openid=wx.getStorageSync('openid');
    wx.request({
      url: api.join_success,
      method: 'POST',
      dataType: 'json',
      data: {
        act_id:id,
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          apply_data: res.data.data
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../activity_content/activity_content?id=' + id,
          })
        }, 2000);
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