// pages/home/home.js
var api = require('../../utils/apiconfig.js');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    book_list_hot_img:'',
    act_data:'',
    hot_reader:'',
    bookcase_data:'',
    sign_hidden:true,
    amb_page:1,
    sign_num:"",
    search_value:'',
  },
// 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        // console.log(res)
      },
      fail: function(res) {
        wx.clearStorageSync();
        wx.reLaunch({
          url: '../get_userinfo/get_userinfo'
        })
      },
      complete: function(res) {
        console.log(res);
      },
    })
    
    // wx.setStorageSync('openid', 'dfasfdhjj121')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var page=this;
    wx.showToast({
      title: '正在加载',
      icon:'loading',
      success(res){
        page.getbanner();
        page.getbestsellers();
        page.getamblist();
        page.getnearbybookcase(); 
        page.getsign();
        page.getactlist();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isnotpay();
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
   * 跳转畅销书单
   */
  openbestsellers:function(){
    wx.navigateTo({
      url: '../bestsellers/bestsellers',
    })
  },
  /**
   * 跳转附近书栈
   */
  opennearbybookcase:function(){
    wx.navigateTo({
      url: '../nearbybookcase/nearbybookcase',
    })
  },
  /**
   * 跳转书栈详情
   */
  openbccontent: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../bookcase_content/bookcase_content?id='+id
    })
  },
  /**
   * 跳转我的借书
   */
  openmyborrow:function(){
    wx.navigateTo({
      url: '../my_borrow/my_borrow'
    })
  },
  /**
   * 跳转书单详情
   */
  openbooklistcontent:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../booklist_content/booklist_content?id='+id
    })
  },
  /**
   * 隐藏签到
   */
  hiddensign:function(){
    this.setData({
      sign_hidden:true
    })
  },
  /**
   * 点击扫码
   */
  saoma:function(){
    var openid=wx.getStorageSync('openid');
    var _this=this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function(res) {
        console.log(res);
        //条形码 书角借书
        if (res.scanType =="EAN_13"){
          var isbn=res.result;
          wx.navigateTo({
            url: '../book_content/book_content?isbn='+isbn+'&is_bookcase=1',
          })
        } else if (res.scanType == "QR_CODE"){
          //二维码 书柜借书
          var order_number = res.result
          //console.log('01' + data);
          _public.postorder(openid, order_number, _public.postordercallback);  
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 同步改变搜索内容
   */
  changesearchvalue: function (event){
    console.log(event);
    var value = event.detail.value;
    this.setData({
      search_value:value
    })
  },
  /**
   * 搜索书名/作者
   */
  searchSubmit: function (event){
    var value=this.data.search_value;
    if (value==""){
      wx.showModal({
        title: '请输入书名或作者',
        showCancel:false,
        confirmText:'确定'
      })
    }else{
      wx.navigateTo({
        url: '../booklist_content/booklist_content?value='+value,
      })
    }
  },
  /**
   * 获取轮播图
   */
  getbanner:function(){
    var page=this;
    wx.request({
      url: api.banner_index,
      method:'POST',
      dataType:'json',
      success(res){
        page.setData({
          imgUrls:res.data.data
        })
      },
      fail(res){
        wx.showToast({
          title: '加载失败',
          icon:'none'
        })
      }
    })
  },
  /**
   * 获取畅销书单
   */
  getbestsellers:function(){
    var _this = this;
    var data={
      page:1,
      type:0
    };
    wx.request({
      url: api.chang_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        _this.setData({
          book_list_hot_img:res.data.data
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
   * 获取热门读书大使
   */
  getamblist:function(){
    var openid=wx.getStorageSync('openid')
    var _this=this;
    var page=_this.data.amb_page;
    var data={
      page: page,
      type:0,
      openid: openid
    };
    wx.request({
      url: api.amb_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        page = _this.data.amb_page+1;
        for(var i=0;i<res.data.data.length;i++){
          if(res.data.data[i].des==null){
            res.data.data[i].des="暂无简介"
          }
          var name=res.data.data[i].name;
          name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
          name = name.replace(/\"/g, "");
          res.data.data[i].name = name;
        }
        _this.setData({
          hot_reader: res.data.data,
          amb_page: page
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
   * 获取附近书栈
   */
  getnearbybookcase:function(){
    var _this=this;
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        var data={
          zuobiao: latitude+','+longitude,
          type:0
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
            console.log(res);
            _this.setData({
              bookcase_data:res.data.data
            })
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
   * 关注用户
   */
  followuser:function(e){
    var openid=wx.getStorageSync('openid');
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var hot_reader = _this.data.hot_reader
    wx.request({
      url: api.user_follow_user,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: openid,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '关注成功',
          })
          hot_reader[index].be_fan = 1;
          _this.setData({
            hot_reader: hot_reader
          })
        } else if (res.data.code ==2){
          wx.showToast({
            icon:'none',
            title: '您不能关注自己',
          })
        }else {
          wx.showToast({
            icon:'none',
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
  },
  /**
   * 获取签到状态
   */
  getsign:function(){
    var openid=wx.getStorageSync('openid');
    var _this=this;
    wx.request({
      url: api.user_sign,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if(res.data.code==1){
          _this.setData({
            sign_hidden: true,
            sign_num:res.data.data
          })
        }else if(res.data.code==0){
          _this.setData({
            sign_hidden:true,
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 取消关注
   */
  cancelfollow:function(e){
    var openid = wx.getStorageSync('openid');
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var hot_reader = _this.data.hot_reader;
    wx.request({
      url: api.cancel_follow,
      method: 'POST',
      dataType: 'json',
      data: {
        openid: openid,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '取消关注',
          })
          hot_reader[index].be_fan = 0;
          _this.setData({
            hot_reader: hot_reader
          })
        } else {
          wx.showToast({
            title: '取消关注失败',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '取消关注失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 打开活动推荐
   */
  openactivityrecommend:function(){
    wx.navigateTo({
      url: '../activity_recommend/activity_recommend',
    })
  },
  /**
   * 打开活动详情
   */
  openactivitycontent:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activity_content/activity_content?id='+id,
    })
  },
  /**
   * 获取活动列表
   */
  getactlist:function(){
    var _this=this;
    wx.request({
      url: api.tui_act_list,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        for (var i = 0; i < res.data.data.length; i++) {
          var initiator = res.data.data[i].initiator;
          initiator = unescape(initiator.replace(/\n/g, '').replace(/\\/g, "%"));
          initiator = initiator.replace(/\"/g, "");
          res.data.data[i].initiator = initiator;
        }
        _this.setData({
          act_data:res.data.data
        })
      },
      fail(res) {
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 跳转发起活动
   */
  openacthost:function(){
    wx.navigateTo({
      url: '../activity_host/activity_host',
    })
  },
  /**
   * 是否有未支付订单
   */
  isnotpay:function(){
    var openid=wx.getStorageSync('openid');
    var _this=this;
    wx.request({
      url: api.checks,
      method: 'POST',
      dataType: 'json',
      data:{
        openid:openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(res.data.code==2){
          var order_number = res.data.data
          wx.showModal({
            title: '您有未支付订单',
            content: '请前往支付',
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../not_pay/not_pay?order_number='+order_number,
                })
              }
            }
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 跳转文章或者详情
   */
  opennew: function (e) {
    var act_id = e.currentTarget.dataset.act_id;
    var _type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (_type == 0) {
      wx.navigateTo({
        url: '../article/article?id=' + id + '&position=0',
      })
    } else if (_type == 1) {
      wx.navigateTo({
        url: '../activity_content/activity_content?id=' + act_id,
      })
    }
  }
})