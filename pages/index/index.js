//index.js
//获取应用实例
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const app = getApp();
import { getToken, checkLogin } from '../../utils/http';

Page({
  data: {
    indicatorDots: true,
    indicatorColor: '#d1e5fb',
    indicatorActiveColor: '#1b7dec',
    autoplay: true,
    interval: 2000,
    duration: 1000,
    indexImgs: [],
    navIcons: [],
    ad:{},
    leak:[],
    taglist: [],
    brand:[],
    prodList:[],
    current: 1,
    pages:0,
    show:false

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    const that =this;
    checkLogin(function(res){
      if(options?.inviteId && res.isNew) {
        that.bindInvite(options?.inviteId)
      }
    })
    this.getAllData();
  },
  bindInvite:function(inviteId){
    var params = {
      url: "/promoter/invitation",
      method: "POST",
      data: {invitationId:inviteId},
      callBack: (res) => {
        const {data,error,message} = res
        console.log('res:', res);
      }
    };
    http.request(params);
  },

  // 页面滚动到指定位置指定元素固定在顶部
  onPageScroll: function(e) { //监听页面滚动
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  toProdPage: function(e) {
    var prodid = e.currentTarget.dataset.prodid;
    if (prodid) {
      wx.navigateTo({
        url: '/pages/prod/prod?prodid=' + prodid,
      })
    }
  },

  // 跳转搜索页
  toSearchPage: function() {
    wx.navigateTo({
      url: '/pages/search-page/search-page',
    })
  },

  //跳转商品活动页面
  toClassifyPage: function(e) {
    var url = '/pages/prod-classify/prod-classify';
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    console.log('id',e)
    if (id) {
      url += "?tagid=" + id + "&title=" + title;
    }
    wx.navigateTo({
      url: url
    })
  },
  

  onShow: function() {
  },
  getAllData() {
    this.setData({
      current: 1,
      pages:0
    })
    this.getIndexImgs();
    this.getGoodsList();
  },
  //加载轮播图
  getIndexImgs() {
    //加载轮播图
    var params = {
      url: "/index",
      method: "GET",
      data: {},
      callBack: (res) => {
        const {data,error,message} = res
        if (error === 0) {
          this.setData({
            indexImgs: data.banner,
            navIcons: data.icon,
            ad:data.ad,
            leak:data.leak,
            brand: data.brand
          });
        }
      }
    };
    http.request(params);
  },

  // 加载商品列表
  getGoodsList() {
    wx.showLoading();
    var params = {
      url: "/index/recommend",
      method: "GET",
      data: {
        page:this.data.current
      },
      callBack: (res) => {
        let prodList = []
        const {data, error} = res
        if (error === 0) {
          const {current, list, pageTotal} = data
          if (current == 1) {
            prodList = list
          } else {
            prodList = this.data.prodList
            prodList = prodList.concat(list)
          }
          this.setData({
            prodList,
            current:parseInt(current),
            pages: current == 1 ? pageTotal : this.data.pages
          });
        }
        wx.hideLoading();
      }
    };
    http.request(params);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function() {
    if (this.data.current < this.data.pages) {
      this.setData({
        current: this.data.current + 1
      })
      this.getGoodsList()
    }
  },

  onPullDownRefresh: function() {

    // wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    var ths = this;
    setTimeout(function() {
      ths.getAllData();
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);

  },

  /**
   * 跳转至商品详情
   */
  showProdInfo: function(e) {
    let relation = e.currentTarget.dataset.relation;
    if (relation) {
      wx.navigateTo({
        url: 'pages/prod/prod',
      })
    }
  },
  onTabItemTap: function (item) {
    console.log('kajsh:', item);
  }
})