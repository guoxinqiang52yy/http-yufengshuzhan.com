// pages/activity_recommend/activity_recommend.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
var openid = wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCity:'',
    page:1,
    act_data: [],
    value:"",
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.value) {
      this.setData({
        value: options.value
      })
    }
    this.getLocation();
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      act_data: [],
      page: 1
    })
    this.getactlist();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getactlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取经纬度
   */
  getLocation: function () {
    var page = this
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  /**
   * 获取城市
   */
  loadCity: function (longitude, latitude) {
    var page = this;
    // console.log(longitude,latitude);
    // 实例化API核心类
    var demo = new QQMapWX({
      key: api.key // 必填
    });

    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        var city = res.result.address_component.city;
        page.setData({
          currentCity: city
        });
        page.getactlist();
        
        
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 准备搜搜
   */
  searchSubmit:function(){
    this.setData({
      page:1,
      act_data:[]
    })
    this.getactlist();
  },
  /**
   * 获取活动列表
   */
  getactlist:function(){
    var _this=this;
    var city=_this.data.currentCity;
    var page=_this.data.page;
    var act_data = _this.data.act_data;
    if(_this.data.value==""){
      var data = {
        type: 1,
        page: page
      }
      var url = api.tui_act_list
    }else if(_this.data.value!=null){
      var data = {
        keyword: _this.data.value,
        page: page
      }
      var url = api.act_list;
    }
    console.log(data);
    wx.request({
      url: url,
      method: 'POST',
      dataType: 'json',
      data:data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            var initiator = list[i].initiator;
            initiator = unescape(initiator.replace(/\n/g, '').replace(/\\/g, "%"));
            initiator = initiator.replace(/\"/g, "");
            list[i].initiator = initiator;
            act_data.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            act_data: act_data,
            page: page
          })
        } else {
          wx.hideToast();
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
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
   * 跳转活动详情
   */
  openactcontent:function(e){
    var _this=this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity_content/activity_content?id='+id,
    })
  },
  /**
   * 同步改变搜索内容
   */
  changesearchvalue: function (event) {
    console.log(event);
    var value = event.detail.value;
    this.setData({
      value: value
    })
  },
  /**
   * 点击扫码
   */
  saoma: function () {
    var openid = wx.getStorageSync('openid');
    var _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function (res) {
        console.log(res);
        //条形码 书角借书
        if (res.scanType == "EAN_13") {
          var isbn = res.result;
          wx.navigateTo({
            url: '../book_content/book_content?isbn=' + isbn + '&is_bookcase=1',
          })
        } else if (res.scanType == "QR_CODE") {
          //二维码 书柜借书
          var order_number = res.result
          //console.log('01' + data);
          _public.postorder(openid, order_number, _public.postordercallback);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})