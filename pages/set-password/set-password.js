// pages/set-password/set-password.js
var http = require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onSubmit:function(val){
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/promoter/withdraw-password",
      method: "POST",
      data: {
        password:val.detail
      },
      callBack: function(res) {
        wx.hideLoading();
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    };
    http.request(params);
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