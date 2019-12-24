// pages/booklist_content/booklist_content.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:null,
    id:null,
    page:1,
    content:[],
    no_hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    if(options.value){
      this.setData({
        value: options.value
      })
    }else if(options.id){
      this.setData({
        id: options.id
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var page = this;
    if (page.data.value!=null){
      page.searchBook();
    }else if(page.data.id!=null){
      page.getbooklistcontent();
    }
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
    var _this = this;
    _this.setData({
      page:1,
      content:[]
    })
    if (_this.data.value != null) {
      _this.searchBook();
    } else if (_this.data.id != null) {
      _this.getbooklistcontent();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    console.log(1)
    if (_this.data.value != null) {
      _this.searchBook();
    } else if (_this.data.id != null) {
      _this.getbooklistcontent();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转图书简介
   */
  openbooklist: function (e) {
    var isbn = e.currentTarget.dataset.isbn;
    wx.navigateTo({
      url: '../book_content/book_content?isbn='+isbn+'&is_bookcase=0'
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
   * 提交书名/作者相关书籍
   */
  searchSubmit:function(event){
    var value=this.data.value;
    if (value == "") {
      wx.showModal({
        title: '请输入书名或作者',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      this.setData({
        value:value,
        id: null,
        page: 1,
        content: [],
      })
      this.searchBook()
    }
  },
  /**
   * 同步改变搜索内容
   */
  changesearchvalue: function (event) {
    var value = event.detail.value;
    this.setData({
      value: value
    })
  },
  /**
   * 查找书籍
   */
  searchBook:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this=this;
    var content = _this.data.content;
    var value = _this.data.value;
    var page = _this.data.page;
    var data={
      keyword:value,
      page:page
    }
    wx.request({
      url: api.search,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            content.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            content: content,
            page: page,
            no_hidden: true
          })
        } else {
          wx.hideToast();
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
          console.log(content)
          if (content.length==0){
            _this.setData({
              no_hidden: false
            })
          }
          
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
   * 获取书单详情
   */
  getbooklistcontent:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this = this;
    var page = _this.data.page;
    var content = _this.data.content;
    var id = _this.data.id;
    wx.request({
      url: api.list_book,
      method: 'POST',
      dataType: 'json',
      data:{
        id:id,
        page:page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.data.length != 0) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            content.push(list[i]);
          }
          page = page + 1;
          _this.setData({
            content: content,
            page: page,
            no_hidden: true
          })
        } else {
          wx.hideToast();
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
          if (content.length == 0) {
            _this.setData({
              no_hidden: false
            })
          }
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