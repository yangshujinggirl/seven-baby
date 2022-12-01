// pages/customer/customer.js
var http = require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceData:{
      wechat:[],
      mobile:[]
    }
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
    this.fetchInfo()
  },
  fetchInfo:function(){
    const _this = this;
    wx.showLoading();
    var params = {
      url: `/service/customer-service`,
      method: "GET",
      callBack: function (res) {
        wx.hideLoading();
        if(!res.error) {
          _this.setData({ serviceData: res.data })
        }
      }
    }
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

  },
  copyBtn: function(e) {
    var content = e.currentTarget.dataset.content
    wx.setClipboardData({
      //准备复制的数据
      data: content,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  }
})