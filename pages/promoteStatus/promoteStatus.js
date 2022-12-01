// pages/promoteStatus/promoteStatus.js
var http = require("../../utils/http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'0',
    statusText:{
      '0':'审核中',
      '1':'恭喜',
      '2':'对不起',
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
    this.fetchPromoteStatus()
  },
  fetchPromoteStatus:function (){
    const _this = this;
    var params = {
      url: "/promoter/audit-status",
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        _this.setData({
          status:res?.data?.audit?.status,
          message:res?.data?.audit?.message
        })
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