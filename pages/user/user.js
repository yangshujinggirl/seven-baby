// pages/user/user.js

var http = require("../../utils/http.js");
const app = getApp();
console.log('app',app)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderAmount: '',
    sts: '',
    collectionCount: 0,
    recommendList:[],
    userRole:app.globalData.roleId || '2',
    funcList:[
      {
        name:'评论互动',
        icon:'../../images/account/func_pl.png',
        linkUrl:'',
        action:''
      },{
        name:'我的收藏',
        icon:'../../images/account/func_sc.png',
        linkUrl:'',
        action:'myCollectionHandle'
      },{
        name:'收货地址',
        icon:'../../images/account/func_dz.png',
        linkUrl:'',
        action:'toAddressList'
      },{
        name:'我要推广',
        icon:'../../images/account/func_tg.png',
        linkUrl:'/pages/promote/promote',
        action:''
      }],
      otherFuncList:[
        {
          name:'佣金商品',
          icon:'../../images/account/func_yjsp.png',
          linkUrl:'/pages/prod-promote/prod-promote',
          action:''
        },{
          name:'推广订单',
          icon:'../../images/account/func_tgdd.png',
          linkUrl:'',
          action:''
        },{
          name:'推荐会员',
          icon:'../../images/account/func_tjhy.png',
          linkUrl:'',
          action:''
        },{
          name:'推广码',
          icon:'../../images/account/func_tgm.png',
          linkUrl:'',
          action:''
        },{
          name:'提现管理',
          icon:'../../images/account/func_txgl.png',
          linkUrl:'',
          action:''
        },{
          name:'社区管理',
          icon:'../../images/account/func_sqgl.png',
          linkUrl:'',
          action:''
        },{
          name:'我的收藏',
          icon:'../../images/account/func_sc.png',
          linkUrl:'',
          action:''
        },{
          name:'收货地址',
          icon:'../../images/account/func_dz.png',
          linkUrl:'',
          action:''
        },
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    //加载订单数字
    var ths = this;
    // var status = ths.data.status
    wx.showLoading();
    var params = {
      url: "/index/recommend",
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          orderAmount: res,
          recommendList:res?.data?.list
        });
      }
    };
    http.request(params);
    // this.showCollectionCount();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleOperate:function(e){
    const linkurl = e.currentTarget.dataset.linkurl;
    const action = e.currentTarget.dataset.action;
    if(!linkurl) {
      wx.showToast({
        icon: "none",
        title: '该功能尚未开启'
      })
      return;
    }
    wx.navigateTo({
      url: linkurl
    })
  },

  toAddressList: function() {
    wx.navigateTo({
      url: '/pages/delivery-address/delivery-address',
    })
  },
  toSettings:function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  // 跳转绑定手机号
  toBindingPhone: function() {
    wx.navigateTo({
      url: '/pages/binding-phone/binding-phone',
    })
  },

  toOrderListPage: function(e) {
    var sts = e.currentTarget.dataset.sts;
    wx.navigateTo({
      url: '/pages/orderList/orderList?sts=' + sts,
    })
  },
  /**
   * 查询所有的收藏量
   */
  showCollectionCount: function() {
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/p/user/collection/count",
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          collectionCount: res
        });
      }
    };
    http.request(params);
  },
  /**
   * 我的收藏跳转
   */
  myCollectionHandle: function() {
    var url = '/pages/prod-classify/prod-classify?sts=5';
    var id = 0;
    var title = "我的收藏商品";
    if (id) {
      url += "&tagid=" + id + "&title=" + title;
    }
    wx.navigateTo({
      url: url
    })
  },
   /**
   * 跳转至商品详情
   */
  toProdPage: function(e) {
    var prodid = e.currentTarget.dataset.prodid;
    if (prodid) {
      wx.navigateTo({
        url: '/pages/prod/prod?prodid=' + prodid,
      })
    }
  }


})