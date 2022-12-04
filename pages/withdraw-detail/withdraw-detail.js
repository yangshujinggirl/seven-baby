// pages/withdraw-detail/withdraw-detail.js
var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchInfo(options?.id)
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
  fetchInfo:function(id){
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/promoter-withdraw/${id}`,
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
        } else {
          let listArr = res.data.list;
          listArr=[{withdrawStatus:'待支付',withdrawAmount:200,withdrawId:1}]
          ths.setData({ info:res.data?.show })
        }
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