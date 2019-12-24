// pages/activity_apply/activity_apply.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_hidden:true,
    user_name:null,
    user_phone:null,
    id:'',
    radio_value:0,
    pay_data:'',
    integral_data:'',
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      money:options.money,
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getintegralinfo();
    this.getUserData();
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
   * 显示支付
   */
  payhidden:function(){
    var _this=this
    var user_name = _this.data.user_name;
    var user_phone = _this.data.user_phone;
    if(user_name==null){
      wx.showToast({
        icon:'none',
        title: '请输入姓名',
      })
      return false;
    }
    if (user_phone == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入电话',
      })
      return false;
    } 
    if (user_phone.length != 11) {
      wx.showToast({
        icon: 'none',
        title: '电话号码格式有误',
      })
      return false;
    }
    _this.openapplyresult();
    // _this.setData({
    //   pay_hidden: false
    // })
  },
  /**
   * 支付回调
   */
  paycallback:function(){
    var id=this.data.id;
    wx.redirectTo({
      url: '../apply_result/apply_result?result=true&id='+id
    })
  },
  /**
   * 隐藏支付
   */
  hiddenpay:function(){
    this.setData({
      pay_hidden: true
    })
  },
  /**
   * 跳转支付结果
   */
  openapplyresult: function () {
    var _this = this;
    _this.setData({
      pay_hidden: true
    })
    var openid = wx.getStorageSync('openid');
    var id = _this.data.id;
    var user_name = _this.data.user_name;
    var user_phone = _this.data.user_phone;
    var money=_this.data.money;
    if(money==0){
      var data = {
        name: user_name,
        mobile: user_phone,
        openid: openid,
        act_id: id,
        type: 4
      }
      console.log(data);
      wx.request({
        url: api.pay_money,
        method: 'POST',
        dataType: 'json',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // form-data提交
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 2) {
            wx.showModal({
              title: '不在报名时间内',
              showCancel: false
            })
          } else if (res.data.code == 3) {
            wx.redirectTo({
              url: '../apply_result/apply_result?result=false',
            })
          } else if (res.data.code == 4) {
            wx.showModal({
              title: '互动只允许会员报名',
              showCancel: false
            })
          } else if (res.data.code == 5) {
            wx.redirectTo({
              url: '../apply_result/apply_result?result=true&id=' + id,
            })
          } else if (res.data.code == 9) {
            wx.showModal({
              title: '您已报名',
              content: '请勿重复报名',
              showCancel: fasle
            })
          }

        },
        fail(res) {
          console.log(res)
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
        }
      })
    }else if(money==1){
      _this.setData({
        pay_hidden: false
      })
    }
    
    
  },
  /**
   * 再次调用支付 
   * */
  openapplyresultagain(){
    var _this = this;
    _this.setData({
      pay_hidden: true
    })
    var openid = wx.getStorageSync('openid');
    var id = _this.data.id;
    var user_name = _this.data.user_name;
    var user_phone = _this.data.user_phone;
    var used = _this.data.radio_value;
    var money=_this.data.money;
    var data = {
      name: user_name,
      mobile: user_phone,
      openid: openid,
      act_id: id,
      type: 4,
      used:used
    }
    wx.request({
      url: api.pay_money,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 1) {
          // var data = res.data;
          _this.setData({
            pay_hidden: false
          })
          _public.requestPayment(res.data, 4, _this.paycallback);
        } else if (res.data.code == 2) {
          wx.showModal({
            title: '不在报名时间内',
            showCancel: false
          })
        } else if (res.data.code == 3) {
          wx.redirectTo({
            url: '../apply_result/apply_result?result=false',
          })
        } else if (res.data.code == 4) {
          wx.showModal({
            title: '互动只允许会员报名',
            showCancel: false
          })
        } else if (res.data.code == 5) {
          wx.redirectTo({
            url: '../apply_result/apply_result?result=true&id=' + id,
          })
        } else if (res.data.code == 9) {
          wx.showModal({
            title: '您已报名',
            content: '请勿重复报名',
            showCancel: fasle
          })
        }
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 实时改变姓名
   */
  changename:function(e){
    var user_name = e.detail.value;
    this.setData({
      user_name:user_name
    })
  },
  /**
   * 实时改变手机号
   */
  changephone:function(e){
    var user_phone = e.detail.value;
    this.setData({
      user_phone:user_phone
    })
  },
  /**
   * 支付选择改变
   */
  radioChange: function (e) {
    var radio_value = e.detail.value;
    this.setData({
      radio_value: radio_value
    })
  },
  /**
   * 获取积分信息
   */
  getintegralinfo: function () {
    var _this = this;
    var openid = wx.getStorageSync('openid');
    var data = {
      openid: openid,
      type: 2
    }
    wx.request({
      url: api.can_use,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        _this.setData({
          integral_data: res.data.data
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
   * 获取用户相关信息
   */
  getUserData:function(){
    var _this=this;
    var openid = wx.getStorageSync('openid');
    var data={
      openid:openid
    }
    wx.request({
      url: api.join_info,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1){
          _this.setData({
            user_name:res.data.data.name,
            user_phone: res.data.data.mobile
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