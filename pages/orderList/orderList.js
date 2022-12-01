var http = require('../../utils/http.js');
var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 1,
    pages: 0,
    sts: '-1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options?.sts) {
      this.setData({
        sts: options.sts
      });
      this.loadOrderData(options.sts, 1);
    } else {
      this.loadOrderData(this.data.sts, 1);
    }
  },

  /**
   * 加载订单数据
   */
  loadOrderData: function(sts, current) {
    var ths = this;
    wx.showLoading();
    //加载订单列表
    var params = {
      url: "/order",
      method: "GET",
      data: {
        page: current,
        size: 10,
        orderStatus: sts,
      },
      callBack: function(res) {
        console.log('res?.data?.list',res?.data?.list)
        ths.setData({
          list: res?.data?.list||[],
          pages: res.pages,
          current: res.current
        });
        wx.hideLoading();
      }
    };
    http.request(params);
  },

  /**
   * 状态点击事件
   */
  onStsTap: function(e) {
    var sts = e.currentTarget.dataset.sts;
    this.setData({
      sts: sts
    });
    this.loadOrderData(sts, 1);
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
    if (this.data.current < this.data.pages) {
      this.loadOrderData(this.data.sts, this.data.current + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  /**
   * 查看物流
   */
  toDeliveryPage: function(e) {
    wx.navigateTo({
      url: '/pages/express-delivery/express-delivery?orderNum=' + e.currentTarget.dataset.ordernum
    })
  },

  /**
   * 取消订单
   */
  handleTab:function(e){
    const type = e.currentTarget.dataset.bindtype;
    const orderid = e.currentTarget.dataset.orderid;
    switch(type){
      case 'cancel':
        this.onCancelOrder(e);
        break;
      case 'goto_pay':
        this.onPayAgain([orderid]);
        break;
      case 'delete':
        this.delOrderList(e);
        break;
      case 'receipt':
        this.onConfirmReceive(e);
        break;
    }
  },
  //取消订单
  onCancelOrder: function(e) {
    var ordernum = e.currentTarget.dataset.ordernum;
    var ths = this;
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      confirmColor: "#EB5412",
      cancelColor: "#181818",
      cancelText: '否',
      confirmText: '是',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });

          var params = {
            url: `/order/${ordernum}/cancel`,
            method: "PUT",
            data: {},
            callBack: function(res) {
              ths.loadOrderData(ths.data.sts, 1);
              wx.hideLoading();
            }
          };
          http.request(params);
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })

  },

  /**
   * 付款
   */
  onPayAgain: function(orderid) {
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/payment",
      method: "POST",
      data: {
        orderIds: orderid
      },
      callBack: res => {
        wx.hideLoading();
        if (res.error === 0) {
          const {paymentData} = res.data
          wx.requestPayment({
            timeStamp: paymentData.timeStamp,
            nonceStr: paymentData.nonceStr,
            package: paymentData.package,
            signType: paymentData.signType,
            paySign: paymentData.paySign,
            success: e => {
              // console.log("支付成功");
              wx.navigateTo({
                url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderid,
              })
            },
            fail: err => {
              wx.navigateTo({
                url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderid,
              })
            }
          })
        } else {
          wx.showToast({
            title: `获取支付信息失败${res.message}`,
            icon: "none"
          })
        }
      }
    };
    http.request(params);
  },


  /**
   * 查看订单详情
   */
  toOrderDetailPage: function(e) {
    console.log('e',e)
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum,
    })
  },

  /**
   * 确认收货
   */
  onConfirmReceive: function(e) {
    var ths = this;
    const  ordernum = e.currentTarget.dataset.ordernum;
    wx.showModal({
      title: '',
      content: '我已收到货？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          var params = {
            url: `/order/${ordernum}/receipt`,
            method: "PUT",
            data: {},
            callBack: function(res) {
              //console.log(res);
              ths.loadOrderData(ths.data.sts, 1);
              wx.hideLoading();
            }
          };
          http.request(params);
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
//删除已完成||已取消的订单
  delOrderList: function(e) {
    var ths = this
    wx.showModal({
      title: '',
      content: '确定要删除此订单吗？',
      confirmColor: "#EB5412",
      cancelColor: "#181818",
      success(res) {
        if (res.confirm) {
          var ordernum = e.currentTarget.dataset.ordernum;
          wx.showLoading();
          var params = {
            url: `/order/${ordernum}`,
            method: "DELETE",
            data: {},
            callBack: function(res) {
              if(res.error) {
                wx.showToast({
                  title: res.message,
                  icon: "none"
                })
              } else {
              ths.loadOrderData(ths.data.sts, 1);
              }
              wx.hideLoading();
            }
          }
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})