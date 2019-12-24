// var url = "http://39.107.102.59/yfsg/";
// var url = "https://paopao.jinjieyihua.com/";
var url ="https://rainlibrary.cn/";
//var url2 = "http://yufeng.jinjieyihua.com/"
module.exports = {
  //雨枫书栈腾讯地图KEY
  // key:'OJHBZ-DB33J-E5RFW-FTRVU-BUJO2-LRFH7',
  //测试用mapKey
  key: 'SLIBZ-OVA6I-4U6GU-5WZQA-IDHHV-V7BW6',
  //首页轮播图
  banner_index: url +"index.php/portal/Index/banner_index",
  //轮播图跳文章详情
  banner_detail: url +'index.php/portal/Index/banner_detail',
  //获取畅销书单
  chang_list: url +'index.php/portal/Index/chang_list',
  //获取热门读书大使
  amb_list: url +'index.php/portal/Index/amb_list',
  //获取附近书栈列表
  stack_list:url+'index.php/portal/Index/stack_list',
  //会员首页信息
  user_index:url+'index.php/portal/user/index',
  //会员详细信息
  user_info:url+'index.php/portal/user/info',
  //会员信息编辑提交
  user_info_edit:url+'index.php/portal/user/info_edit',
  //会员粉丝列表
  user_fans_list: url +'index.php/portal/user/fans_list',
  //关注用户
  user_follow_user:url+'index.php/portal/user/follow_user',
  //用户关注列表
  user_follow_list:url+'index.php/portal/user/follow_list',
  //会员简介
  user_level_info: url +'index.php/portal/user/level_info',
  //我的借书
  user_my_borrow:url+'index.php/portal/user/my_borrow',
  //书栈详情
  boocase_stack_detail:url+'index.php/portal/bookstack/stack_detail',
  //书栈下图书列表
  bookcase_stack_book:url+'index.php/portal/bookstack/stack_book',
  //图书详情
  book_detail:url+'index.php/portal/bookstack/book_detail',
  //获取书单类别
  list_type:url+'index.php/portal/bookstack/list_type',
  //获取书单列表
  book_list: url +'index.php/portal/bookstack/book_list',
  //获取用户阅读币详情
  readmoney_intdetail:url+'index.php/portal/user/intdetail',
  //用户消息列表
  user_news:url+'index.php/portal/user/user_news',
  //用户消息详情
  news_detail: url +'index.php/portal/user/news_detail',
  //用户收藏的图书列表
  book_collect:url+'index.php/portal/user/book_collect',
  //用户收藏图书(动作)
  collect_book:url+'index.php/portal/user/collect_book',
  //用户购买的图书
  book_buy:url+'index.php/portal/user/book_buy',
  //我的书架
  book_box: url +'index.php/portal/user/book_box',
  //获得图书分类(书栈详情)
  book_type: url +'index.php/portal/bookstack/book_type',
  //获取书单里的图书列表
  list_book: url +'index.php/portal/bookstack/list_book',
  //小程序在pad上扫码后下订单
  add_pad_order:url+'index.php/portal/order/add_pad_order',
  //在pad上扫码购书后确认购买
  buy_pad_return:url+'index.php/portal/order/buy_pad_return',
  //在pad上进行扫码后还书
  back_pad_one:url+'index.php/portal/order/back_pad_one',
  //pad还书结算页面
  back_pad_pay:url+'index.php/portal/order/back_pad_pay',
  //pad还书确认
  back_pad_do:url+'index.php/portal/order/back_pad_do',
  //签到接口
  user_sign:url+'index.php/portal/index/user_sign',
  //书角借书
  add_center_order:url+'index.php/portal/order/add_center_order',
  //书角买书
  add_center_buy:url+'index.php/portal/order/add_center_buy',
  //书角还书
  center_back:url+'index.php/portal/order/center_back',
  //书角还书确认
  center_back_do:url+'index.php/portal/order/center_back_do',
  //借转买
  to_buy:url+'index.php/portal/order/to_buy',
  //确认借转买
  to_buy_do:url+'index.php/portal/order/to_buy_do',
  //支付未支付订单
  pay_order:url+'index.php/portal/order/pay_order',
  //确认支付未支付订单
  pay_order_do: url +'index.php/portal/order/pay_order_do',
  //该图书所在书角或书柜
  in_stack:url+'index.php/portal/bookstack/in_stack',
  //附近书角或书柜
  near_stack: url + 'index.php/portal/bookstack/near_stack',
  //搜索书名/作者
  search: url +'index.php/portal/index/search',
  //获取账户信息
  money_list:url+'index.php/portal/user/money_list',
  //取消关注
  cancel_follow: url + 'index.php/portal/user/cancel_follow',
  //获取推荐活动列表
  tui_act_list: url + 'index.php/portal/Index/tui_act_list',
  //活动首页轮播图
  act_banner_list: url +'index.php/portal/activity/banner_list',
  //获取活动类型
  act_get_act_type: url +'index.php/portal/activity/get_act_type',
  //获取活动首页活动列表
  act_list: url +'index.php/portal/activity/act_list',
  //获取活动信息
  act_detail:url+'index.php/portal/activity/act_detail',
  //报名人头像列表
  act_head_list:url+'index.php/portal/activity/head_list',
  //活动评论类表
  act_comment:url+'index.php/portal/activity/act_comment',
  //发起人信息
  act_initiator_info:url+'index.php/portal/activity/initiator_info',
  //活动收藏和取消收藏
  act_collect_act:url+'index.php/portal/activity/collect_act',
  //进行评论
  act_comment_do:url+'index.php/portal/activity/comment_do',
  //热门活动
  hot_act_list:url +'index.php/portal/activity/hot_act_list',
  //支付接口
  get_money:url+'index.php/portal/pay/get_money',
  //退钱
  tuiqian: url + 'index.php/portal/pay/tuiqian',
  //获取openid
  get_openid:url+'index.php/portal/index/getopenid',
  //存用户手机号
  save_mobile:url+'index.php/portal/user/save_mobile',
  //会员充值页信息
  level_data:url+'index.php/portal/user/level_data',
  //积分抵扣接口
  can_use:url+'index.php/portal/user/can_use',
  //调起支付
  pay_money:url+'index.php/portal/pay/pay_money',
  //发起活动
  act_fabu: url +'index.php/portal/activity/fabu',
  //上传图片评论
  upimage:url+'index.php/portal/activity/upimage',
  //我发起的活动
  my_pub:url+'index.php/portal/user/my_pub',
  //我参与的活动
  my_join:url+'index.php/portal/user/my_join',
  //活动收藏
  act_colact: url +'index.php/portal/user/colact_list',
  //确认签到页面
  act_sign:url+'index.php/portal/activity/act_sign',
  //进行签到
  sign_do:url+'index.php/portal/activity/sign_do',
  //报名成功界面
  join_success:url+'index.php/portal/activity/join_success',
  //检查是否有未支付订单
  checks:url+'index.php/portal/index/checks',
  //分享获得积分
  share_do:url+'index.php/portal/user/share_do',
  //书栈确认借书
  borrow_do:url+'index.php/portal/order/borrow_do',
  //获取用户报名信息
  join_info: url +'index.php/portal/activity/join_info',
  //活动报名支付余额
  act_join:url+'index.php/portal/activity/act_join',
//  输入兑换码
  searchexchangecode:url+'index.php/portal/user/change_level'
};