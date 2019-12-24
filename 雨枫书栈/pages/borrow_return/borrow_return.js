// pages/borrow_return/borrow_return.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
var openid=wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCity:"",
    address:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 跳转我的借书
   */
  openmyborrow: function () {
    wx.navigateTo({
      url: '../my_borrow/my_borrow'
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
   * 同步改变搜索内容
   */
  changesearchvalue: function (event) {
    console.log(event);
    var value = event.detail.value;
    this.setData({
      search_value: value
    })
  },
  /**
   * 搜索书名/作者
   */
  searchSubmit: function (event) {
    var value = this.data.search_value;
    if (value == "") {
      wx.showModal({
        title: '请输入书名或作者',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      wx.navigateTo({
        url: '../booklist_content/booklist_content?value=' + value,
      })
    }
  },
})