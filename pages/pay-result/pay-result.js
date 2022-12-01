// pages/pay-result/pay-result.js
var http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sts: 0,
    orderNumbers: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sts: options?.sts,
      orderNumbers: options?.orderNumbers
    });
  },
  toOrderList: function (e) {
    var orderStatus = e.currentTarget.dataset.orderstatus;
    console.log('orderStatus',orderStatus)
    wx.navigateTo({
      url: `/pages/orderList/orderList?sts=${orderStatus}`
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  payAgain: function () {
    console.log('orderNumbers',this.data)
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/payment",
      method: "POST",
      data: {
        // payType: 1,
        orderIds: [this.data.orderNumbers]
      },
      callBack: function (res) {
        const { paymentData } =res.data;
        wx.hideLoading();
        wx.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: paymentData.signType,
          paySign: paymentData.paySign,
          success: e => {
            wx.navigateTo({
              url: `/pages/orderList/orderList?sts=20`
            })
          },
          fail: err => {
            console.log("err",err);
          }
        })

      }
    };
    http.request(params);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})