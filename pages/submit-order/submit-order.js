// pages/submit-order/submit-order.js
var http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    couponSts: 1,
    couponList: [],
    // 订单入口 0购物车 1立即购买
    orderEntry: "0",
    userAddr: null,
    orderItems: [],
    coupon: {
      totalLength: 0,
      canUseCoupons: [],
      noCanUseCoupons: []
    },
    actualTotal: 0,
    transfee: 0,
    reduceAmount: 0,
    remark: "",
    couponIds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderEntry: options.orderEntry,
    });
  },

  //加载订单数据
  loadOrderData: function() {
    var addrId = 0;
    if (this.data.userAddr != null) {
      addrId = this.data.userAddr.addrId;
    }
    wx.showLoading({
      mask: true
    });
    let goods = this.data.orderEntry === "0" ? JSON.parse(wx.getStorageSync("basketIds")) : JSON.parse(wx.getStorageSync("orderItem"))
    var params = {
      url: "/order/confirm",
      method: "POST",
      data: {
        addrId,
        goods
      },
      callBack: res => {
        wx.hideLoading();
        console.log('corf:', res);
        const {error, data} = res
        if (error === 0) {
          const { address, count, list } = data
          const expressAmountArr = list.map(item => item.expressAmount)
          let expressAmountSum = 0
          expressAmountArr.forEach(item => {expressAmountSum+=item})
          this.setData({
            orderItems: list.map(item=>{
              const goods = item.goods.map(ele=>{
                ele.salePrice = Number(ele.salePrice)
                return ele
              })
              return {
                goods,
                expressAmount: item.expressAmount,
                goodsAmount: item.goodsAmount,
                goodsNum: item.goodsNum,
                supplierId: item.supplierId
              }
            }),
            actualTotal: count,
            userAddr: address,
            transfee: expressAmountSum
          });
        }
      },
      errCallBack: res => {
        wx.hideLoading()
      }
    };
    http.request(params);

  },

  onRemarksInput: function (e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  /**
   * 提交订单
   */
  toPay: function() {
    if (!this.data.userAddr) {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
      return;
    }

    this.submitOrder();
  },


  submitOrder: function() {
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/p/order/submit",
      method: "POST",
      data: {
        orderShopParam: [{
          remarks: this.data.remark,
          shopId: 1
        }]
      },
      callBack: res => {
        wx.hideLoading();
        this.calWeixinPay(res.orderNumbers);
      }
    };
    http.request(params);
  },

  /**
   * 唤起微信支付
   */
  calWeixinPay: function(orderNumbers) {
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/p/order/pay",
      method: "POST",
      data: {
        payType: 1,
        orderNumbers: orderNumbers
      },
      callBack: function(res) {
        wx.hideLoading();
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.packageValue,
          signType: res.signType,
          paySign: res.paySign,
          success: e => {
            // console.log("支付成功");
            wx.navigateTo({
              url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + this.data.orderType,
            })
          },
          fail: err => {
            wx.navigateTo({
              url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + "&orderType=" + this.data.orderType,
            })
          }
        })

      }
    };
    http.request(params);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var params = {
    //   url: "/p/address/defaultAddr/" + addrId,
    //   method: "PUT",
    //   data: {
    //     addrId:addrId
    //      },
    //   callBack: function (res) {
    //     wx.hideLoading();

    //   }
    // }
    // http.request(params);

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.selAddress == "yes") {
      this.setData({ //将携带的参数赋值
        userAddr: currPage.data.item
      });
    }
    //获取订单数据
    this.loadOrderData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  changeCouponSts: function(e) {
    this.setData({
      couponSts: e.currentTarget.dataset.sts
    });
  },

  showCouponPopup: function() {
    this.setData({
      popupShow: true
    });
  },

  closePopup: function() {
    this.setData({
      popupShow: false
    });
  },

  /**
   * 去地址页面
   */
  toAddrListPage: function() {
    wx.navigateTo({
      url: '/pages/delivery-address/delivery-address?order=0',
    })
  },
  /**
   * 确定选择好的优惠券
   */
  choosedCoupon: function() {
    this.loadOrderData();
    this.setData({
      popupShow: false
    });
  },

  /**
   * 优惠券子组件发过来
   */
  checkCoupon: function(e) {
    var ths = this;
    let index = ths.data.couponIds.indexOf(e.detail.couponId);
    if (index === -1) {
      ths.data.couponIds.push(e.detail.couponId)
    } else {
      ths.data.couponIds.splice(index, 1)
    }
  }
})