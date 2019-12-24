// pages/get_userinfo/get_userinfo.js
const app = getApp()
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid:null,
    phone:null,
    userInfo:null
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
    this.isopenid();
    // wx.openSetting({
    //   success(res) {
    //     console.log(res.authSetting)
    //   }
    // })
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })
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
   * 判断是否授权
   */
  isopenid:function(){
    var _this=this;
    wx.checkSession({
      success(res){
        console.log(res);
        var openid = wx.getStorageSync('openid');
        var phone = wx.getStorageSync('phone');
        _this.setData({
          openid:openid,
          phone:phone
        })
        if (_this.data.openid != "" && _this.data.phone!=""){
          wx.redirectTo({
            url: '../home/home',
          })
        }else{
          wx.removeStorageSync('openid');
          wx.removeStorageSync('phone')
        }
      },
      fail(res){
        console.log(res);
        wx.removeStorageSync('openid'); 
        wx.removeStorageSync('phone')
      }
    })
  },
  /**
   * 获取用户信息
   */
  bindGetUserInfo(e) {
    var _this=this;
    var userInfo = e.detail.userInfo
    userInfo = JSON.stringify(userInfo);
    wx.login({
      success: function (res) {
        console.log(res);
        var code = res.code;
        var data={
          code:code,
          userInfo: userInfo
        }
        console.log(data);
        if (!userInfo){
          wx.showToast({
            title: '授权失败，请重新授权',
            icon:'none'
          })
          return false;
        }else{
          _this.setData({
            userInfo:userInfo
          })
        }
        wx.request({
          url: api.get_openid,
          method: 'POST',
          dataType: 'json',
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded' // form-data提交
          },
          success(res) {
            console.log("openid")
            console.log(res)
             if (res.data.code == 200) {
              var openid=res.data.data;
              wx.setStorageSync('openid', openid);
              console.log(wx.getStorageSync('openid'))
              _this.setData({
                openid:openid
              })
             } else {
              wx.showToast({
                title: '获取信息失败',
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
  },
  getPhoneNumber(e) {
    var iv=e.detail.iv
    var encryptedData=e.detail.encryptedData
    var _this=this;
    var openid=wx.getStorageSync("openid");

    if(openid==undefined||openid==""){
      wx.showToast({
        title: '请先获取个人信息',
      })
    }else{
      var data={
        encryptedData: encryptedData,
        iv: iv,
        openid:openid
      }
      wx.request({
        url: api.save_mobile,
        method: 'POST',
        dataType: 'json',
        data:data,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // form-data提交
        },
        success(res) {
          if (res.data.data==-41002){
            wx.showToast({
              title: '授权失败，请重新授权',
              icon: 'none'
            })
          }else{
            wx.setStorageSync('phone', res.data.data);
            _this.setData({
              phone: res.data.data
            })
            if (_this.data.openid != null && _this.data.phone != null && _this.data.openid != null){
              wx.redirectTo({
                url: '../home/home',
              })
            }
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
  } 
})