// pages/activity_content/activity_content.js
var api = require('../../utils/apiconfig.js');
var wxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    act_detail:'',
    initiator_info:'',
    head_list:'',
    act_comment:[],
    comment_status:'',
    collect:'',
    to_name:'',
    value:'',
    cid:'',
    comment_page:1,
    more_hidden:true,
    openid:'',
    input_focus:false,
    btnhidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var openid = wx.getStorageSync('openid');
    this.setData({
      openid:openid
    })
    this.getactdetail();
    this.getinitiatordetail();
    this.getapplyhead();
    this.getactcomment();
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
    wx.showShareMenu({
      withShareTicket: true,
    })
    var _this=this;
    var title = _this.data.act_detail.name;
    var id=_this.data.id;
    var openid=_this.data.openid;
    var path ="/pages/activity_content/activity_content?id="+id+"&openid="+openid+"&type=2";
    var imageUrl = _this.data.act_detail.img;
    return {
      title:title,
      path:path,
      imageUrl: imageUrl,
    } 
  },
  /**
   * 打开评论按钮
   */
  opencomment:function(){
    var id=this.data.id
    wx.showActionSheet({
      itemList: ['发表'],
      success(res) {
        var index=res.tapIndex;
        if(index==0){
          wx.navigateTo({
            url: '../activity_comment/activity_comment?id='+id,
          })
        }
      },
    })
  },
  /**
   * 跳转报名页
   */
  openactapply:function(e){
    var id=e.currentTarget.dataset.id;
    var activity_price = this.data.act_detail.activity_price
    if (activity_price==0.00){
      var money=0;
    }else{
      var money = 1;
    }
    wx.redirectTo({
      url: '../activity_apply/activity_apply?id='+id+'&money='+money,
    })
  },
  /**
   * 获取活动信息
   */
  getactdetail:function(){
    var _this=this;
    var openid = _this.data.openid;
    var data={
      id:_this.data.id,
      openid:openid
    }
    wx.request({
      url: api.act_detail,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data.data)
        var a = res.data.data.count - res.data.data.num;
        wxParse.wxParse('activity_des', 'html', res.data.data.activity_des, _this, 0);
        if (a>0) {
          var comment_status = true;
        } else if (a<=0) {
          var comment_status = false;
        }
        if (res.data.data.collected==1){
          var collect=true
        }else{
          var collect = false
        }
        var name = res.data.data.name;
        name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
        name = name.replace(/\"/g, "");
        res.data.data.name = name;
        _this.setData({
          act_detail: res.data.data,
          comment_status: comment_status,
          collect: collect
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
   * 获取发起人信息
   */
  getinitiatordetail:function(){
    var _this=this;
    var openid = _this.data.openid;
    var data={
      id:_this.data.id,
      openid:openid
    }
    wx.request({
      url: api.act_initiator_info,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res)
        var name = res.data.data.name;
        name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
        name = name.replace(/\"/g, "");
        res.data.data.name = name;
        _this.setData({
          initiator_info:res.data.data
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
   * 获取报名人头像
   */
  getapplyhead:function(){
    var _this=this;
    var data={
      id:_this.data.id
    }
    wx.request({
      url: api.act_head_list,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        _this.setData({
          head_list: res.data.data
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
   * 获取活动评论
   */
  getactcomment:function(){
    var _this=this;
    var comment_page = _this.data.comment_page;
    var act_comment = _this.data.act_comment;
    var data = {
      id: _this.data.id,
      page: comment_page
    }
    wx.request({
      url: api.act_comment,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(res.data.data.length==0){
          _this.setData({
            more_hidden:true
          })
        }else{
          comment_page = comment_page + 1;
          for (var i = 0; i < res.data.data.length; i++) {
            var name=res.data.data[i].name;
            name = unescape(name.replace(/\n/g, '').replace(/\\/g, "%"));
            name = name.replace(/\"/g, "");
            res.data.data[i].name=name;
            if (res.data.data[i].child.length > 0) {
              res.data.data[i].child_hidden = false;
              for (var j = 0; j < res.data.data[i].child.length; j++) {
                res.data.data[i].child[j].index = i
                if (res.data.data[i].child[j].form!=""){
                  var form = res.data.data[i].child[j].form;
                  form = unescape(form.replace(/\n/g, '').replace(/\\/g, "%"));
                  form = form.replace(/\"/g, "");
                  console.log(form);
                  res.data.data[i].child[j].form = form;
                }
                if (res.data.data[i].child[j].to){
                  var to = res.data.data[i].child[j].to;
                  to = unescape(to.replace(/\n/g, '').replace(/\\/g, "%"));
                  to = to.replace(/\"/g, "");
                  console.log(to);
                  res.data.data[i].child[j].to = to;
                }
              }
            } else {
              res.data.data[i].child_hidden = true;
            }
            res.data.data[i].reply_hidden = true;
            if (res.data.data[i].img.length == 0) {
              res.data.data[i].img_num = 0
            }
            act_comment.push(res.data.data[i]);
          }
          _this.setData({
            act_comment: act_comment,
            comment_page: comment_page,
            more_hidden: false
          })
          if (res.data.data.length<3){
            _this.setData({
              more_hidden: true
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
   * 收藏活动
   */
  collectact:function(){
    var _this=this;
    var openid = _this.data.openid;
    var data={
      id:_this.data.id,
      openid:openid
    }
    wx.request({
      url: api.act_collect_act,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        wx.showModal({
          title: res.data.data,
          showCancel:false
        })
        if (res.data.data=='收藏成功'){
          _this.setData({
            collect:true
          })
        }else{
          _this.setData({
            collect: false
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
   * 关注用户
   */
  followuser: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var initiator_info = _this.data.initiator_info;
    var openid = _this.data.openid;
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
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '关注成功',
          })
          initiator_info.followed = 1;
          _this.setData({
            initiator_info: initiator_info
          })
          _this.getinitiatordetail();
        } else {
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
  },
  /**
   * 回复评论
   */
  actcomment:function(e){
    var _this=this;
    var to_name = e.currentTarget.dataset.to_name;
    var index=e.currentTarget.dataset.index;
    var cid = e.currentTarget.dataset.cid;
    var act_comment = _this.data.act_comment;
    var btnhidden=true;
    for (var i = 0; i < act_comment.length;i++){
      if(i==index){
        if (act_comment[i].child.length > 0) {
          act_comment[i].child_hidden = false;
        } else {
          act_comment[i].child_hidden = !act_comment[i].child_hidden;
        }
        act_comment[i].reply_hidden = !act_comment[i].reply_hidden;
        if (act_comment[i].reply_hidden==true){
          btnhidden=false;
        }
        act_comment[i].input_focus = !act_comment[i].input_focus;
      }else{
        if (act_comment[i].child.length > 0) {
          act_comment[i].child_hidden = false;
        } else {
          act_comment[i].child_hidden = true;
        }
        act_comment[i].reply_hidden = true;
        act_comment[i].input_focus=false;
      }
    }
    console.log(act_comment)
    _this.setData({
      act_comment: act_comment,
      to_name:to_name,
      cid:cid,
      btnhidden: btnhidden
    })
  },
  /**
   * 输入评论内容
   */
  changevalue:function(e){
    var value = e.detail.value;
    this.setData({
      value: value,
      btnhidden:true
    })
  },
  /**
   * 确定评论
   */
  publishcomment:function(e){
    var _this=this;
    var index=e.currentTarget.dataset.index;
    var openid = _this.data.openid;
    var data={
      type:2,
      cid:_this.data.cid,
      openid:openid,
      content:_this.data.value,
    }
    wx.request({
      url: api.act_comment_do,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res.data.data);
        wx.showToast({
          title: '评论成功',
        })
        var act_comment = _this.data.act_comment;
        if (act_comment[index].child.length>0){
          act_comment[index].child_hidden = false;
        }else{
          act_comment[index].child_hidden = true;
        }
        act_comment[index].reply_hidden = true;
        act_comment[index].input_focus = false;
        _this.setData({
          value:"",
          act_comment: act_comment
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
   * 取消关注
   */
  cancelfollow:function(e){
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var initiator_info = _this.data.initiator_info;
    var openid = _this.data.openid;
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
          initiator_info.followed=0;
          _this.setData({
            initiator_info: initiator_info
          })
          _this.getinitiatordetail();
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
  displaybtn:function(){
    this.setData({
      btnhidden:false
    })
  }
})