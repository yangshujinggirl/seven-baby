// pages/category/category.js

var http = require("../../utils/http.js");
var config = require("../../utils/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId:'-1',
    tabKey:'1',
    followList:[],
    discoveryList:[],
    categoryList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { tabKey } =this.data;
    this.initPage(tabKey)
  },  
  initPage:function(tabKey){
    if(tabKey == '1') {
      this.fetchFollowList()
    } else {
      this.fetchDiscoveryList()
    }
  },
  fetchFollowList:function(){
    var ths = this;
    //加载分类列表
    var params = {
      url: "/community/follow",
      method: "GET",
      data: {},
      callBack: function (res) {
        // console.log(res);
        ths.setData({
          followList: res.data.list||[],
        });
      }
    };
    http.request(params);
  },
  fetchDiscoveryList:function(){
    this.fetchCategory();
    var ths = this;
    //加载分类列表
    var params = {
      url: "/community",
      method: "GET",
      data: {},
      callBack: function (res) {
        // console.log(res);
        ths.setData({
          discoveryList: res.data.list||[],
        });
      }
    };
    http.request(params);
  },
  fetchCategory:function(){
    var ths = this;
    //加载分类列表
    var params = {
      url: "/community/category",
      method: "GET",
      data: {},
      callBack: function (res) {
        // console.log(res);
        ths.setData({
          activityId:res.data.list[0].categoryId,
          categoryList: res.data.list||[],
        });
      }
    };
    http.request(params);
  },
  toCreatPublish:function(){
    wx.navigateTo({
      url: '/pages/creat-publish/creat-publish',
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
  onChangeTab:function(e) {
    console.log('onChangeTab',e)
    const keys = e.currentTarget.dataset.key;
    this.setData({ tabKey:keys })
    this.initPage(keys)
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
})