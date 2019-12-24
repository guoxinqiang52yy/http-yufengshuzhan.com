// pages/bookcase_content/bookcase_content.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
var openid = wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookcase_data:'',
    id:'',
    booklist:[],
    typehidden: true,
    typedata:'',
    order: 0,
    type: 0,
    paihang_type: [
      {
        id: 2,
        type_name: "借阅排行榜",
        type_css: "border_right"
      },
      {
        id: 1,
        type_name: "销售排行榜",
        type_css: ""
      }
    ],
    page: 1,
    currentCity: "",
    longitude:'',
    latitude:'',
    num:null,
    order_number:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    // console.log(options)
    this.setData({
      id: id
    })
    if(options.num&&options.order_number){
      this.setData({
        num:options.num,
        order_number:options.order_number
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation();
    this.getstackdetail();
    this.gettype();
    this.getbooklist();
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
      typehidden: true,
      booklist: [],
      page: 1,
      order: 0,
      type: 0,
      typedata: '',
      paihang_type: [
        {
          id: 2,
          type_name: "借阅排行榜",
          type_css: "border_right"
        },
        {
          id: 1,
          type_name: "销售排行榜",
          type_css: ""
        }
      ]
    })
    this.gettype();
    this.getbooklist();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getbooklist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 显示/隐藏分类
   */
  typehidden:function(e){
    this.setData({
      typehidden: !this.data.typehidden
    })
  },
  /**
   * 被选中类别下划线
   */
  tapborder:function(e){
    var index = e.currentTarget.dataset.index;
    var type_name = e.currentTarget.dataset.type_name;
    var typelist = this.data.typedata;
    for (var i = 0; i < typelist.length; i++) {
      if (i == index) {
        typelist[i].pitch_type = !typelist[i].pitch_type;
      } else {
        typelist[i].pitch_type = false;
      }
    }
    this.setData({
      typedata: typelist,
      type: type_name,
      order: 0,
      page: 1,
      paihang_type: [
        {
          id: 2,
          type_name: "借阅排行榜",
          type_css: "border_right"
        },
        {
          id: 1,
          type_name: "销售排行榜",
          type_css: ""
        }
      ],
      booklist: []
    });
    this.getbooklist();
  },
  /**
   * 选择排行榜类型
   */
  chooserank: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var rank = this.data.paihang_type;
    for (var i = 0; i < rank.length; i++) {
      if (i == index) {
        rank[i].type_css = "border_zi_paihang";
      } else {
        rank[i].type_css = "";
      }
    }
    this.setData({
      paihang_type: rank,
      order: id,
      type: 0,
      page: 1,
      booklist: []
    });
    this.gettype();
    this.getbooklist();
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
        console.log(res);
        var longitude = res.longitude;
        var latitude = res.latitude;
        page.setData({
          longitude: longitude,
          latitude: latitude
        })
        page.loadCity(longitude, latitude);
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
   * 跳转导航页
   */
  gohere:function(){
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var tolongitude = this.data.bookcase_data.longitude;
    var tolatitude = this.data.bookcase_data.latitude;
    var num=this.data.num;
    var order_number=this.data.order_number;
    if(num!=null&&order_number!=null){
      var url = '../maps/maps?longitude=' + longitude + '&latitude=' + latitude + '&tolongitude=' + tolongitude + '&tolatitude=' + tolatitude+'&num='+num+'&order_number='+order_number
    }else{
      var url = '../maps/maps?longitude=' + longitude + '&latitude=' + latitude + '&tolongitude=' + tolongitude + '&tolatitude=' + tolatitude
    }
    wx.redirectTo({
      url: url,
    })
  },
  /**
   * 获取分类
   */
  gettype:function(){
    var _this = this;
    wx.request({
      url: api.book_type,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        var data = res.data.data;
        for (var i = 0; i < data.length; i++) {
          data[i].pitch_type = false;
        }
        _this.setData({
          typedata: data
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
   * 获取书栈详情
   */
  getstackdetail:function(){
    var _this=this;
    var id=_this.data.id;
    wx.request({
      url: api.boocase_stack_detail,
      method: 'POST',
      dataType: 'json',
      data: {
        id:id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          bookcase_data: res.data.data
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
   * 获取图书列表
   */
  getbooklist:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this = this;
    var id=_this.data.id;
    var page = _this.data.page;
    var booklist = _this.data.booklist;
    var type = _this.data.type;
    var order = _this.data.order;
    if (type == 0 && order == 0) {
      var data = {
        page: page,
        id: id
      }
    } else if (type != 0 && order == 0) {
      var data = {
        page: page,
        type: type,
        id:id
      }
    } else if (type == 0 & order != 0) {
      var data = {
        id: id,
        page: page,
        order: order
      }
    }
    console.log(data);
    wx.request({
      url: api.bookcase_stack_book,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(111);
        console.log(res)
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            booklist.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            booklist: booklist,
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
   * 跳转图书详情
   */
  openbookcontent:function(e){
    var isbn = e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: '../book_content/book_content?isbn=' + isbn +'&is_bookcase=0',
    })
  },
  /**
   * 扫码
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