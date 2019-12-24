// pages/activity/activity.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCity:'',
    page:1,
    alltime_hidden:true,
    alltype_hidden:true,
    allregion_hidden: true,
    synthesize_hidden: true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls:'',
    act_type:'',
    act_data: '',
    allcity_hidden:true,
    alltime:[
      {
        time_name:'全时段',
        id: 0
      },
      {
        time_name: '今天',
        id:1,
      },
      {
        time_name: '明天',
        id: 2
      },
      {
        time_name: '本周末',
        id: 3
      },
      {
        time_name: '本月',
        id: 4
      },
    ],
    alltype:[
      {type_name:'全类型'},
      { type_name: '类型1' },
      { type_name: '类型2' },
    ],
    city_list:'',
    synthesize:[
      { synthesize_name:'最新发布',
        status:1
      },
      { synthesize_name: '热门点击', status:2 },
      { synthesize_name: '最多参与', status:3},
    ],
    province_list:'',
    province:null,
    status:null,
    city:null,
    type_id:null,
    dates:null,
    is_filtrate:false,
    search_value: '',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    this.getLocation();  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.gettype();
    this.getactbanner();
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
   * 搜索活动 
   */
  searchSubmit: function (event) {
    var value = this.data.search_value;
    if (value == "") {
      wx.showModal({
        title: '请输入活动名称',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      
    }
  },
  /**
   * 根据活动类型选择
   */
  chooestype:function(e){
    var _this=this;
    var index = e.currentTarget.dataset.index;
    var act_type = _this.data.act_type;
    for (var i = 0; i < act_type.length;i++){
      if(index==i){
        act_type[i].purple ='color-purple';
      }else{
        act_type[i].purple = '';
      }
    }
    _this.setData({
      act_type: act_type
    })
    _this.changetype(e);
  },
  /**
   * 显示全时段
   */
  alltime:function(){
    this.setData({
      alltime_hidden: !this.data.alltime_hidden,
      alltype_hidden: true,
      allregion_hidden: true,
      synthesize_hidden: true,
    })
  },
  /**
   * 显示全类型
   */
  alltype:function(){
    this.setData({
      alltime_hidden: true,
      alltype_hidden: !this.data.alltype_hidden,
      allregion_hidden: true,
      synthesize_hidden: true,
    })
  },
  /**
   * 显示全区域
   */
  allregion:function(){
    this.setData({
      alltime_hidden: true,
      alltype_hidden: true,
      allregion_hidden: !this.data.allregion_hidden,
      synthesize_hidden: true,
    })
    if (this.data.allregion_hidden==false){
      this.getprovince();
    }
  },
  /**
   * 显示综合排序
   */
  synthesize:function(){
    this.setData({
      alltime_hidden: true,
      alltype_hidden: true,
      allregion_hidden:true ,
      synthesize_hidden: !this.data.synthesize_hidden,
    })
  },
  /**
   * 获取活动列表
   */
  getactlist:function(){
    var _this=this;
    var page = _this.data.page;
    if (_this.data.is_filtrate==false){
      var city = _this.data.currentCity;
      var data = {
        city: city,
        page: page
      }
    }else{
      var data={};
      data.page=page
      if(_this.data.province!=null){
        data.province = _this.data.province
      }
      if (_this.data.city != null){
        data.city = _this.data.city 
      }
      if (_this.data.status != null){
        data.status = _this.data.status 
      }
      if (_this.data.type_id != null) {
        data.type = _this.data.type_id 
      }
      if (_this.data.dates != null) {
        data.dates = _this.data.dates 
      }
    }
    console.log(data)
    wx.request({
      url: api.act_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有了',
            icon: 'none'
          })
        } else {
          page = page + 1;
          for (var i = 0; i < res.data.data.length; i++) {
            var initiator = res.data.data[i].initiator;
            initiator = unescape(initiator.replace(/\n/g, '').replace(/\\/g, "%"));
            initiator = initiator.replace(/\"/g, "");
            res.data.data[i].initiator = initiator;
          }
          _this.setData({
            act_data: res.data.data,
            page: page
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
   * 获取类别
   */
  gettype:function(){
    var _this=this;
    wx.request({
      url: api.act_get_act_type,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        var act_type = res.data.data;
        for(var i=0;i<act_type.length;i++){
          act_type[i].purple='';
          if(i>0){
            act_type[i].margin = 'margin-left';
          }
        }
        _this.setData({
          act_type: act_type
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
   * 获取省/直辖市
   */
  getprovince: function () {
    var _this = this;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'SLIBZ-OVA6I-4U6GU-5WZQA-IDHHV-V7BW6' // 必填
    });
    // 调用接口
    demo.getCityList({
      success: function (res) {
        var city = res.result[0];
        console.log(city);
        _this.setData({
          province_list: city
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 更改当城市（区县）
   */
  changecounty: function (e) {
    var _this = this;
    var city_id = e.currentTarget.dataset.id;
    var province = e.currentTarget.dataset.province;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'SLIBZ-OVA6I-4U6GU-5WZQA-IDHHV-V7BW6' // 必填
    });
    // 调用接口
    demo.getDistrictByCityId({
      id: city_id, // 对应城市ID
      success: function (res) {
        console.log(res)
        var county = res.result[0];
        _this.setData({
          province:province,
          allcity_hidden:false,
          allregion_hidden:true,
          city_list: county
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 更改城市,获取城市活动列表
   */
  changecity:function(e){
    var _this = this;
    var city = e.currentTarget.dataset.city;
    var page=1;
    if (city!=0){
      _this.setData({
        status: null,
        city: city,
        type_id: null,
        dates: null,
        is_filtrate: true,
        page: 1,
        allcity_hidden:true,
        act_data: ''
      })
    }else{
      _this.setData({
        status: null,
        city: null,
        type_id: null,
        dates: null,
        is_filtrate: true,
        page: 1,
        allcity_hidden: true,
        act_data: ''
      })
    }
    this.getactlist()

  },
  /**
   * 改变时段
   */
  changetime:function(e){
    var datas = e.currentTarget.dataset.datas;
    if (datas==0){
      this.setData({
        province: null,
        status: null,
        city: null,
        type_id: null,
        dates: null,
        is_filtrate: false,
        page:1,
        alltime_hidden:true,
        act_data: ''
      })
    }else{
      this.setData({
        province: null,
        status: null,
        city: null,
        type_id: null,
        dates: datas,
        is_filtrate: true,
        page: 1,
        alltime_hidden: true,
        act_data: ''
      })
    }
    this.getactlist()
  },
  /**
   * 改变类型
   */
  changetype:function(e){
    var id = e.currentTarget.dataset.id;
    if (id == 0) {
      this.setData({
        province: null,
        status: null,
        city: null,
        type_id: null,
        dates: null,
        is_filtrate: false,
        page: 1,
        alltype_hidden:true,
        act_data: ''
      })
    } else {
      this.setData({
        province: null,
        status: null,
        city: null,
        type_id: id,
        dates: null,
        is_filtrate: true,
        page: 1,
        alltype_hidden:true,
        act_data: ''
      })
    }
    this.getactlist()
  },
  /**
   * 改变关键词
   */
  changekeyword:function(e){
    var status = e.currentTarget.dataset.status;
    this.setData({
      province: null,
      status: status,
      city: null,
      type_id: null,
      dates: null,
      is_filtrate: true,
      page: 1,
      synthesize_hidden:true,
      act_data:''
    })
    this.getactlist()
  },
  /**
   * 获取活动轮播图
   */
  getactbanner:function(){
    var _this=this;
    wx.request({
      url: api.act_banner_list,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          imgUrls:res.data.data
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
   * 打开活动详情
   */
  openactivitycontent: function (e) {
    var id = e.currentTarget.dataset.id;
    this.hiddenTrue();
    wx.navigateTo({
      url: '../activity_content/activity_content?id=' + id,
    })
  },
  /**
   * 打开活动推荐
   */
  openactivityrecommend: function () {
    this.hiddenTrue();
    wx.navigateTo({
      url: '../activity_recommend/activity_recommend',
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
   * 跳转活动
   */
  searchact:function(){
    var value=this.data.search_value;
    if(value==""){
      wx.showToast({
        title: '请输入活动名称',
        icon:"none"
      })
      return false
    }

    this.hiddenTrue();
    wx.navigateTo({
      url: '../activity_recommend/activity_recommend?value='+value,
    })
  },
  /**
   * 人气榜 
   */
  hotactivity:function(){
    var _this=this;
    wx.request({
      url: api.hot_act_list,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有了',
            icon: 'none'
          })
        } else {
          _this.setData({
            act_data: res.data.data
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
   * 跳转活动发起
   */
  openacthost:function(){
    this.hiddenTrue();
    wx.navigateTo({
      url: '../activity_host/activity_host',
    })
  },
  /**
   * 打开活动收藏
   */
  openactcollect: function () {
    this.hiddenTrue();
    wx.navigateTo({
      url: '../activity_collect/activity_collect',
    })
  },
  /**
   * 跳转文章或者详情
   */
  opennew:function(e){
    var act_id=e.currentTarget.dataset.act_id;
    var _type = e.currentTarget.dataset.type;
    var id=e.currentTarget.dataset.id;
    if(_type==0){
      this.hiddenTrue();
      wx.navigateTo({
        url: '../article/article?id='+id+'&position=1',
      })
    }else if(_type==1){
      this.hiddenTrue();
      wx.navigateTo({
        url: '../activity_content/activity_content?id=' + act_id,
      })
    }
  },
  /**
   * 隐藏分类查询框
   */
  hiddenTrue:function(){
    this.setData({
      alltime_hidden: true,
      alltype_hidden: true,
      allregion_hidden: true,
      synthesize_hidden: true,
      allcity_hidden: true
    })
  }
})