// pages/member_content/member_content.js
var api = require('../../utils/apiconfig.js');
var wxParse = require('../../wxParse/wxParse.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    textV:'',
    vip_type:"",
    pay_hidden:true,
    userData:'',
    yes_hidden:true,
    member_goon:true,
    member_rule:"",
    pay_type:'',
    pay_money:'',
    integral_data:'',
    level:'',
    radio_value:0,
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync("openid");
    this.setData({
      openid:openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getlevelinfo();
    this.getmemberinfo();
    this.getintegralinfo();
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
  showpay:function(){
    this.setData({
      pay_hidden: false
    })
    if (this.data.userData.level!=0){
      this.setData({
        member_goon: !this.data.member_goon
      })
    }else{
      this.setData({
        yes_hidden: !this.data.yes_hidden
      })
    }
    
  },
  /*输入兑换码
  * 控制显示*/
  eject:function(){
    this.setData({
      showModal:true
    })
  },
  /**
   * 点击返回按钮隐藏
   */
  back:function(){
    this.setData({
      showModal:false
    })
  },
  /**
   * 获取input输入值
   */
  wish_put:function(e){
    this.setData({
      textV:e.detail.value
    })
  },
  /**
   * 点击确定按钮获取input值并且关闭弹窗
   */
  ok:function(){
    var url = api.searchexchangecode
    wx.request({
      url: url,
      method: 'POST',
      dataType: 'json',
      data:{
      openid:wx.getStorageSync('openid'),
      number:this.data.textV
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.code===1){
          wx.showToast({
            title: "使用成功",
          })
          this.setData({
            showModal:false
          })
        }
        if (res.data.code===0){
          wx.showToast({
            title: '参数错误',
          })
        }
        if (res.data.code===-1){
          wx.showToast({
            title: '兑换码不存在',
          })
        }
        if (res.data.code===-2){
          wx.showToast({
            title: '该码已使用过',
          })
          this.setData({
            showModal:false
          })
        }
        if (res.data.code===-3){
          wx.showToast({
            title: '兑换码过期',
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
   * 隐藏支付
   */
  hiddenpay:function(){
    this.setData({
      pay_hidden:true,
      yes_hidden:true,
      member_goon:true
    })
  },
  /**
   * 选择vip类型
   */
  choosevip:function(e){
    var index = e.currentTarget.dataset.index;
    var level = e.currentTarget.dataset.level;
    var _this = this;
    var vip_type_list = _this.data.vip_type;
    for (var i = 0; i < vip_type_list.length; i++) {
      if (i == index) {
        vip_type_list[i].choose ="vip_choose" ;
        wxParse.wxParse('member_rule', 'html', vip_type_list[i].detail, _this, 0);
        _this.setData({
          pay_type: vip_type_list[i].level_name,
          pay_money: vip_type_list[i].level_price,
          level: level,
        });
      } else {
        vip_type_list[i].choose = "";
      }
    }
    _this.setData({
      vip_type: vip_type_list
    });
  },
  /**
   * 打开成为会员页
   */
  openbecomemember:function(){
    var _this=this;
    var level=_this.data.level;
    var type=2;
    var used=_this.data.radio_value;
    var openid=_this.data.openid;
    var data={
      level: level,
      openid:openid,
      type:type,
      used:used
    }
    console.log(data)
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
        _public.requestPayment(data, 3, _this.paycallback);
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
   * 支付界面显示
   */
  yes_true:function(){
    this.setData({
      member_goon: true,
      yes_hidden:false
    });
  },
  /**
   *获取会员充值类型
   */
  getlevelinfo:function(){
    var _this=this;
    wx.request({
      url: api.user_level_info,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        var vip_type = res.data.data.level_list;
        var member_rule = vip_type[0].detail;
        for (var i = 0; i < vip_type.length;i++){
          if(i==0){
            vip_type[i].choose ="vip_choose";
          } else {
            vip_type[i].choose = '';
          }
        }
        wxParse.wxParse('member_rule', 'html', member_rule, _this, 0);
        _this.setData({
          vip_type: vip_type,
          pay_money: vip_type[0].level_price,
          level: vip_type[0].level,
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
   * 获取用户会员信息
   */
  getmemberinfo:function(){
    var _this = this;
    var openid = _this.data.openid;
    wx.request({
      url: api.level_data,
      method: 'POST',
      dataType: 'json',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.data.level!=0){
          res.data.data.is_member=true;
        }
        _this.setData({
          userData:res.data.data
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
   * 获取积分信息
   */
  getintegralinfo:function(){
    var _this=this;
    var openid = _this.data.openid;
    var data={
      openid:openid,
      type:1
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
          integral_data:res.data.data
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
   * 支付选择改变
   */
  radioChange:function(e){
    var radio_value = e.detail.value;
    this.setData({
      radio_value: radio_value
    })
  }
})