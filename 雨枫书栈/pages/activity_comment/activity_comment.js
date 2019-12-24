// pages/activity_comment/activity_comment.js
var api = require('../../utils/apiconfig.js');
var openid = wx.getStorageSync('openid');
var _public = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFiles:[],
    add_hidden:false,
    add_left:'',
    add_top:'',
    id:'',
    value:'',
    url_data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    this.setData({
      id:id
    })
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
   * 选择图片
   */
  addimg:function(){
    var _this=this;
    var url_data = _this.data.url_data;
    wx.showActionSheet({
      itemList: ['拍照','从手机相册选择'],
      success(res){
        var index=res.tapIndex;
        var sourceType='';
        if(index==0){
          sourceType = 'camera';
        }else if(index==1){
          sourceType = 'album';
        }
        wx.chooseImage({
          count: 6,
          sizeType: ['original', 'compressed'],
          sourceType: [sourceType],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            console.log(res);
            var tempFiles = _this.data.tempFiles;
            var count = tempFiles.length;
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            for (var i = 0; i < res.tempFiles.length;i++){
              url_data.push(res.tempFiles[i].path)
              var num=count+i;
              if(num<=6){
                var fileExtension = res.tempFiles[i].path.substring(res.tempFiles[i].path.lastIndexOf('.') + 1);
                var name = Math.random().toString(36).substr(2, 15);
                name = timestamp + '_' + name + '.' + fileExtension;
                var data = { 'name': name, 'path': res.tempFiles[i].path, 'size': res.tempFiles[i].size} ;
                if(num!=0&&num!=3){
                  data.mar_left ='mar-left';
                }
                if(num>=3){
                  data.mar_top ='mar-top';
                }
                tempFiles.push(data);
              } 
            }
            if (tempFiles.length != 0 && tempFiles.length!=3){
              var add_left='mar-left';
            }else{
              var add_left = '';
            }
            if (tempFiles.length >= 3){
              var add_top='mar-top'
            }else{
              var add_top = ''
            }
            if (tempFiles.length>=6){
              var add_hidden=true;
            }else{
              var add_hidden = false;
            }
            console.log(tempFiles)
            _this.setData({
              tempFiles: tempFiles,
              add_left: add_left,
              add_top: add_top,
              add_hidden: add_hidden,
            })
          }
        })
      }
    })
  },
  /**
   * 发表评论
   */
  publishcomment:function(){
    wx.showLoading({
      title: '正在提交',
      mask:true
    })
    var openid = wx.getStorageSync('openid');
    var _this=this;
    var value=_this.data.value;
    var data={
      type:1,
      act_id: _this.data.id,
      openid: openid,
      content: value
    }
    var tempFiles = _this.data.tempFiles;
    wx.request({
      url: api.act_comment_do,
      method: 'POST',
      dataType: 'json',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // form-data提交
      },
      success(res) {
        console.log(res);
        if(tempFiles.length==0){
          wx.hideLoading();
          wx.showModal({
            title: "评论成功",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else{
          _this.uploadimg(tempFiles, res.data.data);  
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
   * 改变评论内容
   */
  changevalue:function(e){
    var value = e.detail.value;
    this.setData({
      value:value
    })
  },
  //多图上传
  uploadimg:function(data,cid){
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: api.upimage,
      filePath: data[i].path,
      name: 'file',//这里根据自己的实际情况改
      formData: {
        cid: cid
      },//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          wx.hideLoading();
          wx.showModal({
            title: "评论成功",
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data,cid);
        }
      }
    });
  },
  /**
   * 取消发布
   */
  cancelcomment:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 显示图片
   */
  previewImage:function(e){
    var _this=this;
    var current = e.currentTarget.dataset.current;
    var url_data=_this.data.url_data;
    wx.previewImage({
      urls:url_data,
      current: current
    })
  }
})