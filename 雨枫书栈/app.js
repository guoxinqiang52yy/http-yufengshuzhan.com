//app.js
var api = require('utils/apiconfig.js');
App({
  onLaunch: function (options) {
    console.log('转发')
    console.log(options);
    if(options.scene==1044){
      var openid=options.query.openid;
      var _type=options.query.type;
      var shareTicket = options.shareTicket;
      console.log(openid);
      console.log(shareTicket);
      wx.getShareInfo({
        shareTicket: shareTicket,
        success(res){
          console.log(res);
          var encryptedData = res.encryptedData;
          var iv=res.iv;
          var url = api.share_do;
          var data = {
            iv: iv,
            encryptedData: encryptedData,
            openid: openid,
            type:_type
          }
          console.log(data);
          if (_type == 1) {
            var isbn = options.query.isbn;
            data.isbn=isbn;
          } else if (_type == 2) {
            var id = options.query.id;
            data.act_id=id
          }
          console.log(data);
          wx.request({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: data ,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // form-data提交
            },
            success(res) {
              console.log(res)
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
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})