// pages/promotionCode/promotionCode.js
var http = require("../../utils/http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetCode()
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
  test(){
    wx.previewMedia({
      sources:[{
        url: this.data.qrcodeUrl,
      }],
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const globalData = getApp().globalData
    return {
      title: '我的邀请码',
      path: `/pages/index/index?inviteId=${globalData.id}`,
      imageUrl: '../../images/customer/pic.png',
      success: (res) => {
        // 分享成功
      },
      fail: (res) => {
        // 分享失败
      }
    }
  },
  fetCode:function(){
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/promoter/invitation-image",
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          qrcodeUrl: res.data.invitationUrl,
        });
      }
    };
    http.request(params);
  },
  toHome:function(){
    console.log('12',12)
    wx.switchTab({
      url: '/pages/index/index?invitationId=12',
    })
  }
})