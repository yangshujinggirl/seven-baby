// pages/setting.js
var http = require("../../utils/http.js");
import { getBaseUserInfo } from '../../utils/http';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    showPhone:false,
    showPassword:false,
    phoneVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  getPhoneNumber:function(e){
    console.log('e',e)
    const { userInfo } =this.data;
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/user/mobile",
      method: "GET",
      data: {code:e.detail.encryptedData},
      callBack: function(res) {
        wx.hideLoading();
        this.setData({ userInfo:{...userInfo, mobile:res.message }})
      }
    };
    http.request(params);
  },
  toAuthPage:function(){
    wx.navigateTo({
        url: '/pages/authorization/authorization',
    })
  },
  toBindPhone:function(){
    this.setData({showPhone:true})
  },
  onClose:function(){
    this.setData({showPhone:false})
  },
  onConfirm:function(){
    const  { phoneVal } = this.data;
    const ths = this;
    var regexp = /^[1]([3-9])[0-9]{9}$/;
    if (!regexp.test(phoneVal)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none"
      })
      return;
    }
    var params = {
      url: "/user",
      method: "PUT",
      data: {
        mobile:phoneVal
      },
      callBack: function(res) {
        wx.hideLoading();
        ths.fetchUserInfo();
      }
    };
    http.request(params);
  },  
  fetchUserInfo:function(){
    const ths = this;
    getBaseUserInfo(function(res){
      ths.setData({ userInfo: res.data?.user})
    })
  },
  toSetPassword:function(){
    wx.navigateTo({
      url: '/pages/set-password/set-password',
    })
  },
  toAbout:function(){
    wx.navigateTo({
      url: '/pages/about-us/about-us',
    })
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
    this.fetchUserInfo()
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