// pages/my-collect/my-collect.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchList();
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

  },
  fetchList: function(sts, current) {
    var ths = this;
    wx.showLoading();
    //加载订单列表
    var params = {
      url: "/user/goods-collection",
      method: "GET",
      data: {
        page: 0,
      },
      callBack: function(res) {
        ths.setData({
          list: res?.data?.list||[],
        });
        wx.hideLoading();
      }
    };
    http.request(params);
  },
  cancelCollect: function(e) {
    var prodid = e.currentTarget.dataset.id;
    var ths = this;
    wx.showLoading();
    //加载订单列表
    var params = {
      url: `/goods/${prodid}/collect`,
      method: "PUT",
      data: {},
      callBack: function(res) {
       if(res.error) {
         wx.showToast({
           title: res.message,
         })
         return;
       }
       ths.fetchList()
        wx.hideLoading();
      }
    };
    http.request(params);
  },
   /**
   * 跳转至商品详情
   */
  toProdPage: function(e) {
    var prodid = e.currentTarget.dataset.id;
    if (prodid) {
      wx.navigateTo({
        url: '/pages/prod/prod?prodid=' + prodid,
      })
    }
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