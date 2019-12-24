// pages/change_regoin/change_regoin.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync("openid");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityhidden:true,
    countyhidden:true,
    city_list:[],
    county_list:[],
    regoin:"",
    county:'',
    province:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.regoin!='null') {
      var regoin = options.regoin;
      this.setData({
        regoin: regoin
      })
    } else if (options.regoin == 'null'){
      this.setData({
        regoin: '请选择地区'
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
    this.postregoin()
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
   * 更改当前省（直辖市）
   */
  changecity:function(){
    var page = this;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: api.key // 必填
    });
    // 调用接口
    demo.getCityList({
      success: function (res) {
        var city=res.result[0];
        page.setData({
          city_list: city,
          countyhidden: true,
          cityhidden:false,
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
  changecounty:function(e){
    var page = this;
    var city_id = e.currentTarget.dataset.id;
    var city_name = e.currentTarget.dataset.city;
    console.log(city_name);
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'SLIBZ-OVA6I-4U6GU-5WZQA-IDHHV-V7BW6' // 必填
    });
    // 调用接口
    demo.getDistrictByCityId({
      id: city_id, // 对应城市ID
      success: function (res) {
        var county=res.result[0];
        page.setData({
          province:city_name,
          regoin: city_name,
          cityhidden: true,
          county_list: county,
          countyhidden:false
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 更改区域
   */
  changeregoin:function(e){
    var province=this.data.province;
    var county = e.currentTarget.dataset.city;
    this.setData({
      county: county
    })
    var city=this.data.county;
    var regoin = province + ' ' + city;
    this.setData({
      regoin:regoin
    })
  },
  /**
   * 提交区域
   */
  postregoin:function(){
    var regoin = this.data.regoin;
    if (regoin =='请选择地区'){
      regoin=''
    }
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_info_edit,
      method: 'POST',
      dataType: 'json',
      data: {
        region: regoin,
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