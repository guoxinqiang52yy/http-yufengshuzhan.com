// pages/affirm_return/affirm_return.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_order:null,
    order_number:null,
    num:null,
    name:'',
    price:'',
    time:'',
    book_price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.back_order){
      var back_order = options.back_order;
      this.setData({
        back_order: back_order,
        num:options.num
      })
    }else if(options.order_number){
      this.setData({
        order_number: options.order_number,
        num: options.num
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.num==0){
      this.postReturnBookPad()
    }else if(this.data.num==1){
      this.postReturnBook();
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
   * 获取还书信息pad
   */
  postReturnBookPad:function(){
    var _this=this;
    var openid = wx.getStorageSync('openid');
    var data={
      openid:openid,
      back_order:_this.data.back_order
    }
    var url = api.back_pad_pay
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
        if(res.data.code==1){
          _this.setData({
            name:res.data.data.book_name,
            price:res.data.data.price,
            time:res.data.data.time,
            book_prince: res.data.data.sell_price,
            order_number:res.data.data.order_number
          })
        } else if (res.data.code == 0){
          wx.showModal({
            title: '还书确认失败',
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
   * 获取还书信息书角
   */
  postReturnBook:function(){
    var _this = this;
    var zuobiao = '';
    var order_number = _this.data.order_number;
    var openid = wx.getStorageSync('openid');
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        zuobiao = latitude + ',' + longitude;
      }
    })
    var data = {
      openid: openid,
      order_number: order_number,
      zuobiao: zuobiao
    }
    var url = api.center_back
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
        if (res.data.code == 1) {
          _this.setData({
            name: res.data.data.book_name,
            price: res.data.data.price,
            time: res.data.data.time,
            book_prince: res.data.data.sell_price
          })
        } else if (res.data.code == 0) {
          wx.showModal({
            title: '还书确认失败',
          })
        } else if (res.data.code == 7) {
          wx.showModal({
            title: '未在书角范围内',
            content: '请到书角内进行还书',
            showCancel: false,
            success(res) {
              if (res.confirm == true) {
                wx.redirectTo({
                  url: '../home/home',
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
  },
  /**
   * 还书返回信息
   */
  returnCallback:function(){
    var _this=this
    if (_this.data.num == 0) {
      _this.returnpad();
    } else if (_this.data.num == 1) {
      _this.returncenter();
      
    }
    
  },
  /**
   * 书柜还书确认
   */
  returnpad:function(){
    var _this = this;
    var book_price=_this.data.book_price;
    var price = _this.data.book_price;
    var openid = wx.getStorageSync('openid');
    var content='';
    if(book_price<price){
      content='您的换书价格大于购买价格'
    }
    wx.showModal({
      title: '是否购买本书',
      content: content,
      success(res){
        console.log(res);
        if(res.confirm==true){
          _public.borrowtobuy(openid, _this.data.order_number, _public.borrowbuydo)
        }else if(res.cancel==true){
          var data = {
            openid: openid,
            back_order: _this.data.back_order
          }
          console.log(data);
          var url = api.back_pad_do;
          wx.request({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: data,
            header: {
              'content-type': 'application/x-www-form-urlencoded' // form-data提交
            },
            success(res) {
              console.log(res);
              if (res.data.code == 1) {
                wx.showModal({
                  title: '还书成功',
                  showCancel: false,
                  success(res) {
                    if (res.confirm == true) {
                      wx.redirectTo({
                        url: '../home/home',
                      })
                    }
                  }
                })
              } else if (res.data.code == 0) {
                wx.showModal({
                  title: '余额不足',
                  content: '请充值余额',
                  showCancel:false,
                  success(res){
                    if(res.confirm){
                      wx.navigateTo({
                        url: '../member/member',
                      })
                    }
                  }
                })
              }else if(res.data.code==5){
                wx.showModal({
                  title: '图书未还至书柜',
                  content: '请还书后在进行确认',
                  showCancel:false
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
      }
    })
    
  },
  /**
   * 还书确认书角
   */
  returncenter:function(){
    var _this = this;
    var book_price = _this.data.book_price;
    var price = _this.data.book_price;
    var content = '';
    var openid = wx.getStorageSync('openid');
    if (book_price < price) {
      content = '您的换书价格大于购买价格'
    }
    wx.showModal({
      title: '是否购买本书',
      content: content,
      success(res) {
        if (res.confirm) {
          _public.borrowtobuy(openid, _this.data.order_number, _public.borrowbuydo)
        } else if (res.cancel) {
          wx.getLocation({
            type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
            success: function (res) {
              // success  
              var longitude = res.longitude
              var latitude = res.latitude
              var zuobiao = latitude + ',' + longitude;
              var data = {
                openid: openid,
                order_number: _this.data.order_number,
                zuobiao: zuobiao
              }
              var url = api.center_back_do;
              wx.request({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: data,
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // form-data提交
                },
                success(res) {
                  if (res.data.code == 1) {
                    wx.showModal({
                      title: '还书成功',
                      showCancel: false,
                      success(res) {
                        if (res.confirm == true) {
                          wx.redirectTo({
                            url: '../home/home',
                          })
                        }
                      }
                    })
                  } else if (res.data.code == 0) {
                    wx.showModal({
                      title: '余额不足',
                      content: '请充值余额',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.navigateTo({
                            url: '../member/member',
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
      }
    })
    
  },
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  }
})