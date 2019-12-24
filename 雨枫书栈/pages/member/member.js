// pages/member/member.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mywallethidden:true,
    myreadidhidden:true,
    collecthidden:true,
    signaturehidden:true,
    userData:"",
    openid:'',
    balance_hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var openid = wx.getStorageSync("openid");
    _this.setData({
      openid: openid
    })
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
    this.getuserInfo();
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
   * 跳转我的书架
   */
  openmybookrack:function(){
    wx.navigateTo({
      url: '../mybookrack/mybookrack',
    })
  },
  /**
   * 我的钱包显示
   */
  mywallet_true:function(e){
    this.setData({
      mywallethidden: !this.data.mywallethidden
    })
  },
  /**
   * 我的阅读账号显示
   */
  myreadid_true:function(e){
    this.setData({
      myreadidhidden: !this.data.myreadidhidden
    })
  },
  /**
   * 打开阅读币
   */
  openreadmoney:function(){
    wx.navigateTo({
      url: '../readmoney/readmoney',
    })
  },
  /**
   * 跳转我的消息
   */
  openmymessage:function(){
    wx.navigateTo({
      url: '../mymessage/mymessage',
    })
  },
  /**
   * 跳转会员简介
   */
  openmembercontent:function(){
    wx.navigateTo({
      url: '../member_content/member_content',
    })
  },
  /**
   * 打开我的借书（在读)
   */
  openmyborrow:function(){
    wx.navigateTo({
      url: '../my_borrow/my_borrow'
    })
  },
  /**
   * 打开我的购买
   */
  openmybuy:function(){
    wx.navigateTo({
      url: '../my_buy/my_buy'
    })
  },
  /**
   * 打开我的收藏
   */
  openmybookcollect:function(){
    wx.navigateTo({
      url: '../mybook_collect/mybook_collect'
    })
  },
  /**
   * 我的收藏下显示
   */
  mycollect_true:function(){
    this.setData({
      collecthidden: !this.data.collecthidden
    })
  },
  /**
   * 显示会员个性签名
   */
  // signature_true:function(){
  //   this.setData({
  //     signaturehidden: !this.data.signaturehidden
  //   })
  // },
  /**
   * 跳转至粉丝页面
   */
  openfans:function(){
    wx.navigateTo({
      url: '../fans/fans'
    })
  },
  /**
   * 跳转至关注页面
   */
  openattention:function(){
    wx.navigateTo({
      url: '../attention/attention',
    })
  },
  /**
   * 跳转至个人资料
   */
  openmydata:function(){
    wx.navigateTo({
      url:'../mydata/mydata',
    })
  },
  /**
   * 获取用户信息
   */
  getuserInfo:function(){
    var _this=this;
    wx.request({
      url: api.user_index,
      method: 'POST',
      dataType: 'json',
      data:{
        openid:_this.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        var name=res.data.data.name;
        name=unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
        name = name.replace(/\"/g, "");
        res.data.data.name=name;
        console.log(res.data.data);
        _this.setData({
          userData: res.data.data
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
   * 跳转我的账户明细
   */
  mybalance:function(){
    wx.navigateTo({
      url: '../my_balance/my_balance',
    })
  },
  /**
   * 跳转我参与的活动 已完成
   */
  openactdone:function(){
    wx.navigateTo({
      url: '../activity_done/activity_done',
    })
  },
  /**
   * 跳转我参与的活动 进行中
   */
  openactdoing:function(){
    wx.navigateTo({
      url: '../activity_doing/activity_doing',
    })
  },
  /**
   * 跳转我参与的活动 未开始
   */
  openactnotstart:function(){
    wx.navigateTo({
      url: '../activity_notstart/activity_notstart',
    })
  },
  /**
   * 跳转我参与的活动 活动收藏
   */
  openactcollect:function(){
    wx.navigateTo({
      url: '../activity_collect/activity_collect',
    })
  },
  /**
   * 充值余额
   */
  paymoney:function(){
    
  },
  /**
   * 退押金
   */
  depositRefund:function(){
    wx.showLoading({
      title: '正在进行',
      mask:false,
    })
    var _this=this;
    wx.request({
      url: api.tuiqian,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: _this.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code==1){
          wx.showToast({
            title: '押金已退回',
          })
        } else if (res.data.code == 2){
          wx.showToast({
            title: '您未支付押金',
          })
        }else if(res.data.code==3){
          wx.showModal({
            title: '您尚有图书未还',
            content: '请还书后重新退押金',
            showCancel:false
          })
        } else if (res.data.code == 4){
          wx.showModal({
            title: '您尚有订单未支付',
            content: '请支付订单后重新退押金',
            showCancel: false
          })
        }else{
          wx.showToast({
            title: res.data.data,
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
   * 充值押金
   */
  payDeposit:function(){
    var  _this=this;
    wx.request({
      url: api.pay_money,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: _this.data.openid,
        type:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data);
        if(res.data.code==1){
          var data = res.data;
          _public.requestPayment(data, 2, _this.paycallback);
        }else{
          wx.showToast({
            title: res.data.data,
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
   * 支付回调
   */
  paycallback:function(result){
    if(result){
      this.onReady();
    }
  },
  /**
   * 充值余额显示
   */
  balancehidden:function(){
    this.setData({
      balance_hidden: false
    })
  },
  /**
   * 改变充值金额
   */
  changebalance:function(e){
    var balance_value = e.detail.value;
    this.setData({
      balance_value: balance_value
    })
  },
  /**
   * 确认充值余额
   */
  paybalance:function(){
    var _this=this;
    var data={
      openid: _this.data.openid,
      money: _this.data.balance_value,
      type:3
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
        var data = res.data;
        _this.setData({
          balance_hidden:true
        })
        _public.requestPayment(data, 1, _this.paycallback);
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
   * 跳转活动发起
   */
  openacthost: function () {
    wx.navigateTo({
      url: '../activity_host/activity_host',
    })
  },
  /**
   * 跳转 加入会员 已完成
   */
  openmydone:function(){
    wx.navigateTo({
      url: '../activity_mydone/activity_mydone',
    })
  },
  /**
   * 跳转 我发起的活动 进行中
   */
  openmydoing:function(){
    wx.navigateTo({
      url: '../activity_mydoing/activity_mydoing',
    })
  },
  /**
   * 跳转 我发起的活动 待审核
   */
  openidnotcheck:function(){
    wx.navigateTo({
      url: '../activity_notcheck/activity_notcheck',
    })
  },
  /**
   * 跳转 我发起的活动 未开始
   */
  openmynotstart:function(){
    wx.navigateTo({
      url: '../activity_mynotstart/activity_mynotstart',
    })
  },
  /**
   * 跳转 我发起的活动 未通过
   */
  opennotpass:function(){
    wx.navigateTo({
      url: '../activity_notpass/activity_notpass',
    })
  },
  /**
   * 取消充值
   */
  payhidden:function(){
    this.setData({
      balance_hidden: true
    })
  }
})