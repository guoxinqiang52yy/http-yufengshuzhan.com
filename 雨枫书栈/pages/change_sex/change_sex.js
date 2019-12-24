// pages/change_sex/change_sex.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync("openid");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '男', value: '1', checked:''},
      { name: '女', value: '2', checked:''}
    ],
    sex:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var sex_arr = _this.data.items;
    if (options.sex) {
      var sex = options.sex;
      if (sex != 0) {
        for (var i = 0; i < sex_arr.length; i++) {
          if (sex_arr[i].value == sex) {
            sex_arr[i].checked = "sex-choosed";
          } else {
            sex_arr[i].checked = "";
          }
        }
      }
      _this.setData({
        sex: sex,
        items: sex_arr
      })
    } else {
      _this.setData({
        sex: ''
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
    this.postsex();
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
   * 更改性别
   */
  changechoose:function(e){
    var choose_value = e.currentTarget.dataset.value;
    var sex_arr=this.data.items;
    for (var i = 0; i < sex_arr.length;i++){
      if (sex_arr[i].value == choose_value){
        sex_arr[i].checked ="sex-choosed";
      }else{
        sex_arr[i].checked = "";
      }
    }
    this.setData({
      items: sex_arr,
      sex: choose_value
    })
  },
  /**
   * 提交修改性别
   */
  postsex:function(){
    var sex=this.data.sex;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_info_edit,
      method: 'POST',
      dataType: 'json',
      data: {
        sex: sex,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
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