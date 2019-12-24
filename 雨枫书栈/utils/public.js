var api = require('/apiconfig.js');
var QQMapWX = require('/qqmap-wx-jssdk.js');
//向后台提交openid与订单号
function postorder(openid, order_number, callback) {
  var data = {
    openid: openid,
    order_number: order_number
  }
  var info = 'a';
  wx.request({
    url: api.add_pad_order,
    method: 'POST',
    dataType: 'json',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // form-data提交
    },
    success(res) {
      callback(res.data);
    },
    fail(res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  })
}
//在pad上扫码购书后确认购买
function affirmbuy(openid, order_number, callback) {
  var data = {
    openid: openid,
    order_number: order_number
  }
  wx.request({
    url: api.buy_pad_return,
    method: 'POST',
    dataType: 'json',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // form-data提交
    },
    success(res) {
      callback(res.data);
    },
    fail(res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  })
}
/**
 * 扫码后还书
 * openid
 * 借书订单号
 * 还书订单号
 */
function scanCodereturn(openid, order_number, back_order, callback) {
  var data = {
    openid: openid,
    order_number: order_number,
    back_order: back_order
  }
  wx.request({
    url: api.back_pad_one,
    method: 'POST',
    dataType: 'json',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // form-data提交
    },
    success(res) {
      callback(res.data);
    },
    fail(res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  })
}
/**
 * 还书结算页面
 * openid
 * 借书订单号
 */
function returnsettlement(openid, back_order, callback) {
  var data = {
    openid: openid,
    back_order: back_order
  }
  wx.request({
    url: api.back_pad_pay,
    method: 'POST',
    dataType: 'json',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // form-data提交
    },
    success(res) {
      callback(res.data);
    },
    fail(res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  })
}

/**
   * 提交订单号回调
   */
function postordercallback(res) {
  console.log("扫码返回")
  console.log(res);
  if (res.code == 1) {
    var back_order = res.data.order_number;
    var name = res.data.book_name;
    var price = res.data.price;
    var time = res.data.time;
    wx.navigateTo({
      url: '../affirm_borrow/affirm_borrow?name=' + name + '&price=' + price + '&back_order=' + back_order + '&time=' + time,
    })
  } else if (res.code == 2) {
    var order_number = res.data.data;
    wx.navigateTo({
      url: '../not_pay/not_pay?order_number=' + order_number,
    })
  } else if (res.code == 3) {
    wx.showModal({
      title: '未交押金',
      content: '请充值押金或成为会员'
    })
  } else if (res.code == 4) {
    wx.showModal({
      title: '借书已达上限',
      content: '请在我的还书中进行还书',
      success(res) {
        if (res.confirm == true) {
          //跳转我的借书
          wx.navigateTo({
            url: '../my_borrow/my_borrow',
          })
        }
      }
    })
  } else if (res.code == 5) {
    var order_number = res.data.order_number;
    var book_name = res.data.book_name;
    var price = res.data.price;
    var time = res.data.time;
    wx.navigateTo({
      url: '../affirm_buy/affirm_buy?order_number=' + order_number + '&book_name=' + book_name + '&price=' + price + '&time=' + time + '&is_bookcase=1',
    })
  } else if (res.code == 10) {
    wx.showModal({
      title: '管理员拿书',
      showCancel: false
    })
  } else if (res.code == 6) {
    //还书
    // wx.navigateTo({
    //   url: '../my_borrow/my_borrow?return_scon=2&is_bookcase=1'
    // })
  } else if (res.code == 11) {
    wx.showModal({
      title: '扫码成功',
      content: '已跳转至活动发布页',
      showCancel: false
    })
  } else if (res.code == 20) {
    wx.showModal({
      title: '您已签到',
      content: '请勿重复签到',
      showCancel: false
    })
  } else if (res.code == 21) {
    wx.navigateTo({
      url: '../activity_sign/activity_sign?id=' + res.data,
    })
  } else if (res.code == 22) {
    var id = res.data;
    wx.navigateTo({
      url: '../activity_content/activity_content?id=' + id,
    })
  } else if (res.code == 28) {
    wx.showModal({
      title: '未参加活动',
      showCancel: false
    })
  } else {
    wx.showModal({
      title: '无法识别',
      content: '请核对二维码',
      showCancel: false
    })
  }
}
/**
 * 借转买
 * 
 */
function borrowtobuy(openid, order_number, callback) {
  var data = {
    openid: openid,
    order_number: order_number
  }
  wx.request({
    url: api.to_buy,
    method: 'POST',
    dataType: 'json',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // form-data提交
    },
    success(res) {
      console.log(res);
      callback(res.data);
    },
    fail(res) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  })
}
/**
 * 确认借转买
 */
function borrowbuydo(res) {
  var order_number = res.data.order_number;
  var book_name = res.data.book_name;
  var price = res.data.price;
  var time = res.data.time;
  if (res.code == 1) {
    wx.showModal({
      title: '购买订单生成',
      content: '请确认购书信息',
      showCancel: false,
      success(res) {
        if (res.confirm == true) {
          wx.navigateTo({
            url: '../affirm_buy/affirm_buy?order_number=' + order_number + '&book_name=' + book_name + '&price=' + price + '&time=' + time + '&is_bookcase=0',
          })
        }
      }
    })
  } else if (res.code == 2) {
    wx.showModal({
      title: '订单生成失败',
      content: '请稍候再试',
    })
  } else if (res.code == 0) {
    wx.showModal({
      title: '余额不足',
      content: '请充值余额',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../member/member',
          })
        }
      }
    })
  }
}
/**
 * wx支付接口
 * type：1.充值余额 2.充值押金 3.充值会员 4.活动报名
 */
function requestPayment(data, type, callback) {
  wx.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.package,
    signType: data.signType,
    paySign: data.paySign,
    success(res) {
      console.log("支付");
      console.log(res);
      if (type == 1) {
        var result = true;
        callback(result)
      } else if (type == 2) {
        var result = true;
        callback(result)
      } else if (type == 3) {
        wx.navigateTo({
          url: '../become_member/become_member'
        })
      } else if (type == 4) {
        var result = true;
        callback(result)
      }
    },
    fail(res) {
      console.log(res)
      wx.showToast({
        title: '支付失败',
      })
    }
  })
}
//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.xxx is not a function;
module.exports = {
  postorder: postorder,
  affirmbuy: affirmbuy,
  scanCodereturn: scanCodereturn,
  returnsettlement: returnsettlement,
  postordercallback: postordercallback,
  borrowtobuy: borrowtobuy,
  borrowbuydo: borrowbuydo,
  requestPayment: requestPayment
}