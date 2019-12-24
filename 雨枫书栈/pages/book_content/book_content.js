// pages/book_content/book_content.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
var wxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn:'',
    collect:true,
    book_detail:'',
    //0从图书列表进入 1书角扫条形码 2书柜进入
    is_bookcase:'',
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isbn=options.isbn;
    var is_bookcase = options.is_bookcase;
    this.setData({
      isbn:isbn,
      is_bookcase: is_bookcase
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var openid = wx.getStorageSync("openid");
    this.setData({
      openid:openid
    })
    this.getbookdetail()
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
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true,
    })
    var openid = _this.data.openid;
    var title = _this.data.book_detail.book_name;
    var isbn = _this.data.isbn;
    var path = "/pages/book_content/book_content?isbn=" + isbn + "&openid=" + openid + "&type=1&is_bookcase=0";
    var imageUrl = _this.data.book_detail.img;
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
    }
  },
  /**
   * 改变收藏状态
   */
  collectType:function(){
    var _this=this;
    var isbn=_this.data.isbn;
    var openid = _this.data.openid;
    wx.request({
      url: api.collect_book,
      method: 'POST',
      dataType: 'json',
      data: {
        isbn: isbn,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(res.data.code==1){
          wx.showToast({
            title: '收藏成功',
            icon:'success'
          })
          _this.setData({
            collect: true
          })
        }else{
          wx.showToast({
            title: '收藏失败',
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
   * 取消收藏
   */
  cancelcollect: function () {
    var _this = this;
    var isbn = _this.data.isbn;
    var openid = _this.data.openid;
    wx.request({
      url: api.collect_book,
      method: 'POST',
      dataType: 'json',
      data: {
        isbn: isbn,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1) {
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success'
          })
          _this.setData({
            collect: false
          })
        } else {
          wx.showToast({
            title: '取消收藏失败',
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
   * 获取图书详情
   */
  getbookdetail:function(){
    var _this=this;
    var isbn=_this.data.isbn;
    var openid = _this.data.openid;
    console.log("点击人");
    console.log(openid);
    wx.request({
      url: api.book_detail,
      method: 'POST',
      dataType: 'json',
      data: {
        isbn:isbn,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(res.data.code==1){
          if (res.data.data.collected == 0) {
            _this.setData({
              collect: false
            })
          } else if (res.data.data.collected == 1) {
            _this.setData({
              collect: true
            })
          }
          wxParse.wxParse('detail', 'html', res.data.data.detail, _this, 0);
          _this.setData({
            book_detail: res.data.data
          })
        } else if (res.data.code == 0){
          wx.showModal({
            title: '暂无该书籍',
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '查询失败',
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
  },
  /**
   * 书角借书
   */
  borrowbook:function(){
    var _this=this;
    var is_bookcase=_this.data.is_bookcase;
    var openid = _this.data.openid;
    //图书列表进入 跳转附近书栈
    if(is_bookcase==0){
      var isbn=_this.data.isbn;
      wx.navigateTo({
        url: '../nearbybookcase/nearbybookcase?isbn=' + isbn +'&bookhide=1',
      })
    }else if(is_bookcase==1){
      //书角扫条形码进入 直接调用借书
      wx.getLocation({
        type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
        success: function (res) {
          // success  
          var longitude = res.longitude;
          var latitude = res.latitude;
          var isbn=_this.data.isbn;
          var data = {
            zuobiao: latitude + ',' + longitude,
            openid: openid,
            isbn:isbn
          }
          wx.request({
            url: api.add_center_order,
            method: 'POST',
            dataType: 'json',
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // form-data提交
            },
            success(res) {
              console.log(res);
              _public.postordercallback(res.data);
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
  },
  /**
   * 买书
   */
  buybook:function(){
    var _this = this;
    var openid = _this.data.openid;
    var is_bookcase = _this.data.is_bookcase;
    //图书列表进入 跳转附近书栈
    if (is_bookcase == 0) {
      var isbn = _this.data.isbn;
      wx.navigateTo({
        url: '../nearbybookcase/nearbybookcase?isbn=' + isbn+'&bookhide=1',
      })
    }  else if (is_bookcase == 1) {
      //书角扫条形码进入 直接调用借书
      wx.getLocation({
        type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
        success: function (res) {
          // success  
          var longitude = res.longitude;
          var latitude = res.latitude;
          var isbn = _this.data.isbn;
          var data = {
            zuobiao: latitude + ',' + longitude,
            openid: openid,
            isbn: isbn
          }
          wx.request({
            url: api.add_center_buy,
            method: 'POST',
            dataType: 'json',
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // form-data提交
            },
            success(res) {
              console.log(res)
              if(res.data.code==0){
                //失败
                wx.showToast({
                  title: '购买失败',
                  icon:'none'
                })
              }else if(res.data.code==1){
                //成功
                var order_number = res.data.data.order_number;
                var book_name = res.data.data.book_name;
                var price = res.data.data.price;
                var time = res.data.data.time;
                wx.showModal({
                  title: '下单成功',
                  content: '请确认订单信息后购买',
                  showCancel:false,
                  success(res){
                    if (res.confirm==true){
                      wx.navigateTo({
                        url: '../affirm_buy/affirm_buy?order_number=' + order_number + '&book_name=' + book_name + '&price=' + price + '&time=' + time + '&is_bookcase=0',
                      })
                    }
                  }
                })
              } else if (res.data.code == 2){
                var order_number=res.data.data;
                wx.showModal({
                  title: '有未支付订单',
                  content: '请完成未支付订单',
                  success(res) {
                    if (res.confirm == true) {
                      //跳转还书确认
                      wx.navigateTo({
                        url: '../not_pay/not_pay?order_number=' + order_number,
                      })
                    }
                  }
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
  },
  /**
   * 分享获得积分
   */
  sharefunction:function(){
    wx.getShareInfo({
      shareTicket: '',
    })
  }
})