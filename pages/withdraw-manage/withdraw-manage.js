// pages/withdraw-manage/withdraw-manage.js
var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawAmount:'',
    isChecked:false,
    user:{},
    order:{},
    show:false,
    Length: 6, //输入框个数
    isFocus: false, //聚焦 唤起键盘
    Value: "", //输入的密码内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
    disabled: true,//下一步按钮可否可点击
    show: false,  //弹出框
  },
  onCalcel:function(){
    this.setData({show:false,Value:'',isFocus:false})
  },
  Focus(e) {
    console.log('e',e)
    var that = this;
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
      })
      that.onSubmit(inputValue)
    } else {
      that.setData({
        disabled: true,
      })
    }
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
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
  takeAll:function(){
    this.setData({withdrawAmount:this.data.order.canWithdrawAmount})
  },
  onSubmit:function(val){
    var ths = this;
    const { withdrawAmount,Value } =this.data;
    wx.showLoading();
    var params = {
      url: "/promoter-withdraw",
      method: "POST",
      data: {
        withdrawAmount,
        withdrawPassword:val
      },
      callBack: function(res) {
        wx.hideLoading();
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
          wx.navigateTo({
            url: '/pages/withdraw-list/withdraw-list'
          })
        } else {
          wx.navigateTo({
            url: '/pages/withdraw-list/withdraw-list'
          })
        }
      }
    };
    http.request(params);
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
    const { order, withdrawAmount } =this.data;
    if(withdrawAmount > order.canWithdrawAmount) {
      wx.showToast({
        title: '提现金额不能超出可提现金额',
      })
      // return;
    }
    this.setData({show:true})
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
  getKeyboard:function(){
    wx.onKeyboardHeightChange(res => {
      console.log(res.height)
    })
  }
})