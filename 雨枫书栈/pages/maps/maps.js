// pages/maps/maps.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var api = require('../../utils/apiconfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_btn:[
      {
        type_num:0,
        path:'../../images/jiache3x.png',
        navigation_type:'driving',
        type_text:'驾车',
        type_class:'color_orange'
      },
      // {
      //   type_num: 1,
      //   path: '../../images/gongjiao3x.png',
      //   navigation_type: 'transit',
      //   type_text: '公交',
      //   type_class: ''
      // },
      {
        type_num: 1,
        path: '../../images/buxing3x.png',
        navigation_type: 'walking',
        type_text: '步行',
        type_class: ''
      },
      {
        type_num: 2,
        path: '../../images/qixing3x.png',
        navigation_type: 'bicycling',
        type_text: '骑行',
        type_class: ''
      }
    ],
    fromlongitude:[],
    fromlatitude:[],
    navigation_type: 'driving',
    tolongitude:'',
    tolatitude:'',
    polyline:{},
    setInter:'',
    num:null,
    order_number:null,
    markers:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var markers=[
      {
        id:1,
        latitude: options.latitude,
        longitude: options.longitude,
        title:'起始位置'
      },
      {
        id: 2,
        latitude: options.tolatitude,
        longitude: options.tolongitude,
        title: '目标位置'
      },
    ]
    this.setData({
      fromlongitude: options.longitude,
      fromlatitude: options.latitude,
      tolongitude: options.tolongitude,
      tolatitude: options.tolatitude,
      markers:markers
    })
    if(options.num&&options.order_number){
      this.setData({
        num: options.num,
        order_number: options.order_number
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.navigation();
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
    clearInterval(this.data.setInter)
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
   * 选择导航类型
   */
  changetype:function(e){
    var type_data = this.data.type_btn;
    var num = e.currentTarget.dataset.num;
    console.log(type_data[num])
    for (var i = 0; i < type_data.length;i++){
      if (num == type_data[i].type_num){
        if(i==0){
          type_data[i].path ='../../images/jiache3x.png';
        }
        // else if(i==1){
        //   type_data[i].path = '../../images/gongjiao3x72.png';
        // }
        else if(i==1){
          type_data[i].path = '../../images/buxing3x24.png';
        }else if(i==2){
          type_data[i].path = '../../images/qixing3x81.png';
        }
        type_data[i].type_class ='color_orange';
      }else{
        if (i == 0) {
          type_data[i].path = '../../images/jiache3x99.png';
        }
        //  else if (i == 1) {
        //   type_data[i].path = '../../images/gongjiao3x.png';
        // } 
        else if (i == 1) {
          type_data[i].path = '../../images/buxing3x.png';
        } else if (i == 2) {
          type_data[i].path = '../../images/qixing3x.png';
        }
        type_data[i].type_class = '';
      }
    }
    this.setData({
      navigation_type: type_data[num].navigation_type,
      type_btn: type_data
    })
    this.navigation();
  },
  /**
   * 导航
   */
  navigation:function(){
    var _this = this;
    clearInterval(_this.data.setInter)
    var key = api.key; // 必填
    var navigation_type = _this.data.navigation_type;
    var fromlatitude = _this.data.fromlatitude;
    var fromlongitude = _this.data.fromlongitude;
    var tolatitude=_this.data.tolatitude;
    var tolongitude=_this.data.tolongitude;
    //网络请求设置
    var opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: 'https://apis.map.qq.com/ws/direction/v1/' + navigation_type + '/?from=' + fromlatitude + ',' + fromlongitude + '&to=' + tolatitude + ',' + tolongitude+'&key=' + key,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        console.log(res);
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来
        _this.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 3
          }]
        })
        // _this.calculateDistance();
        _this.data.setInter = setInterval(_this.calculateDistance,2000)
      }
    };
    wx.request(opt);
  },
  /**距离计算 */
  calculateDistance:function(){
    var _this=this;
    wx.getLocation({
      type: 'gcj02',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var fromlongitude = res.longitude
        var fromlatitude = res.latitude
        // 实例化API核心类
        var demo = new QQMapWX({
          key: api.key // 必填
        });
        var tolatitude = _this.data.tolatitude;
        var tolongitude = _this.data.tolongitude;  
        // 调用接口
        demo.calculateDistance({
          from: {
            latitude: fromlatitude,
            longitude: fromlongitude
          },
          to: [{
            latitude: tolatitude,
            longitude: tolongitude
          }],
          success: function (res) {
            console.log(res);
            if (res.result.elements[0].distance <= 500) {
              clearInterval(_this.data.setInter)
              console.log("daoda")
              var num=_this.data.num;
              var order_number = _this.data.order_number
              console.log(order_number)
              if (num==1&&order_number!=null){
                wx.redirectTo({
                  url: '../affirm_return/affirm_return?num='+num+'&order_number='+order_number,
                })
              }else{
                wx.showModal({
                  title: '已导航至附近书栈',
                  content: '返回首页进行相关操作',
                  showCancel:false,
                  success(res){
                    if(res.confirm==true){
                      wx.redirectTo({
                        url:'../home/home'
                      })
                    }
                  }
                })
              }
            }
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });  
      }
    })
    
    
    
  }
})