// pages/withdraw-manage/withdraw-manage.js
var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked:false,
    user:{},
    order:{}
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
    this.fetchInfo();
  },
  fetchInfo:function(){
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/promoter-withdraw/create",
      method: "GET",
      data: {},
      callBack: function(res) {
        wx.hideLoading();
        ths.setData({
          user: res?.data?.user,
          order:res?.data?.order
        });
      }
    };
    http.request(params);
  },
  switchChange:function(e){
    this.setData({isChecked:!this.data.isChecked})
  },
  onSave:function(){
    const { withdrawAmount } =this.data;
    console.log('withdrawAmount',withdrawAmount)
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