// pages/recommend-member/recommend-member.js
var http = require("../../utils/http.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    count:{},
    userInfo:app.globalData.userInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchList()
    this.fetchTotal();
    this.setData({userInfo:app.globalData.userInfo})
  },
  fetchList:function(){
    const _this = this;
    var params = {
      url: "/promoter/member",
      method: "GET",
      data: {
        page:1
      },
      callBack: function(res) {
        wx.hideLoading();
        _this.setData({list:res?.data?.list})
      }
    };
    http.request(params);
  },
  fetchTotal:function(){
    const _this = this;
    var params = {
      url: "/promoter/member-count",
      method: "GET",
      callBack: function(res) {
        wx.hideLoading();
        _this.setData({totalInfo:res?.data?.count})
      }
    };
    http.request(params);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})