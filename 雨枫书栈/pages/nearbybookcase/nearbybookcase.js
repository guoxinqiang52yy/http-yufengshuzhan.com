// pages/nearbybookcase/nearbybookcase.js
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompts_hidden:true,
    bookcase_data: [],
    page:1,
    isbn:null,
    num:null,
    order_number:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.bookhide==1){
      var isbn=options.isbn;
      this.setData({
        prompts_hidden:false,
        isbn:isbn
      })
    } else if (options.bookhide == 2){
      var num = options.num;
      this.setData({
        prompts_hidden: true,
        num: num,
        order_number:options.order_number
      })
    }else{
      this.setData({
        prompts_hidden: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this=this;
    var num=_this.data.num;
    var isbn=_this.data.isbn;
    if(num!=null||isbn!=null){
      //根据书栈类别或根据ISBN好查询书栈
      _this.searchbookcase();
    }else{
      _this.getbookcase();
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
    this.setData({
      bookcase_data: [],
      page: 1,
    })
    var num=this.data.num;
    var isbn=this.data.isbn;
    if (num != null || isbn!=null){
      this.searchbookcase();
    }else{
      this.getbookcase();
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var num = this.data.num;
    var isbn = this.data.isbn;
    if (num != null || isbn != null) {
      this.searchbookcase();
    } else {
      this.getbookcase();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 跳转书栈详情
   */
  openbccontent: function (e) {
    var id = e.currentTarget.dataset.id;
    var num=this.data.num;
    var order_number = this.data.order_number;
    if(order_number!=null&&num!=null){
      var url = '../bookcase_content/bookcase_content?id=' + id+'&num='+num+'&order_number='+order_number
    }else{
      url = '../bookcase_content/bookcase_content?id=' + id
    }
    wx.redirectTo({
      url: url
    })
  },
  /**
   * 获取书栈
   */
  getbookcase:function(){
    wx.showToast({
      title: '正在加载',
      icon:'loading'
    })
    var _this = this;
    var page=_this.data.page;
    var bookcase_data = _this.data.bookcase_data;
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        var data = {
          zuobiao: latitude + ',' + longitude,
          type: 1,
          page:page
        }
        wx.request({
          url: api.stack_list,
          method: 'POST',
          dataType: 'json',
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded' // form-data提交
          },
          success(res) {
            console.log(res)
            if (res.data.data.length!=0){
              var list = res.data.data;
              for(var i=0;i<list.length;i++){
                bookcase_data.push(list[i]);
              }
              page=page+1;
              _this.setData({
                bookcase_data: bookcase_data,
                page:page
              })
            }else{
              wx.hideToast();
              wx.showToast({
                title: '没有更多了',
                icon:'none'
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
  },
  /**
   * 根据书栈类型或ISBN号搜索书栈
   */
  searchbookcase:function(){
    wx.showToast({
      title: '正在加载',
      icon: 'loading'
    })
    var _this=this;
    var num=_this.data.num;
    var isbn=_this.data.isbn;
    var page=_this.data.page;
    var bookcase_data = _this.data.bookcase_data;
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        if (num != null) {
          var data = {
            zuobiao: latitude + ',' + longitude,
            type: num,
            page: page
          }
          var url = api.near_stack
        } else if (isbn != null) {
          var data = {
            zuobiao: latitude + ',' + longitude,
            isbn: isbn,
            page: page
          }
          var url = api.in_stack
        }
        console.log(data)
        console.log(url);
        wx.request({
          url: url,
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
                bookcase_data.push(list[i]);
              }
              page = page + 1;
              _this.setData({
                bookcase_data: bookcase_data,
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
      }
    })
    
  }
})