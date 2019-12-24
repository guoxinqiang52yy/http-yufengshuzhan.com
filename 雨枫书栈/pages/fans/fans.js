// pages/fans/fans.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fanslist:[],
    page:1,
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
    this.getfanslist();
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
      fanslist: [],
      page: 1,
    })
    this.getfanslist();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getfanslist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取粉丝列表
   */
  getfanslist:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var openid = wx.getStorageSync('openid');
    var _this = this;
    var page = _this.data.page;
    var fanslist = _this.data.fanslist;
    var data = {
      page: page,
      openid: openid
    };
    wx.request({
      url: api.user_fans_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
            name = name.replace(/\"/g, "");
            list[i].name = name;
            fanslist.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            fanslist: fanslist,
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
   * 关注
   */
  followuser:function(e){
    var _this=this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var fanslist = _this.data.fanslist;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: api.user_follow_user,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: openid,
        id:id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if(res.data.msg=='success'){
          wx.showToast({
            title: '关注成功',
          })
          fanslist[index].be_fun=1;
          _this.setData({
            fanslist: fanslist
          })
        }else{
          wx.showToast({
            title: '关注失败',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '关注失败',
          icon: 'none'
        })
      }
    })
  }
})