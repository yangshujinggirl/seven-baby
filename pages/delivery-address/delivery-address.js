// pages/delivery-address/delivery-address.js

var http = require("../../utils/http.js");
// var config = require("../../utils/config.js");

Page({
  data: {
    defaultSize: 'mini',
    disabled: false,
    plain: true,
    loading: false,
    addressList: [],
    addAddress: '',
    order: -1
  },

  onLoad: function (option) {
    if (option?.order) {
      this.setData({
        order: option.order
      });
    }
  },

  //新增收货地址
  onAddAddr: function (e) {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress',
    })
  },

  //设置为默认地址
  onDefaultAddr: function (e) {
    var addrId = e.currentTarget.dataset.addrid;
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/address/${addrId}/modify`,
      method: "PUT",
      callBack: function (res) {
        wx.hideLoading();
      }
    }
    http.request(params);
  },

  //加载地址列表
  onShow: function () {
   this.fetchList()
  },
  fetchList:function(){
    wx.showLoading();
    const ths = this;
    var params = {
      url: "/address",
      method: "GET",
      data: {},
      callBack: res => {
        const {error, data} = res
        if (error === 0) {
          ths.setData({
            addressList: data.list
          });
          wx.hideLoading();
        }
      }
    };
    http.request(params);
  },

// 修改地址 
  toEditAddress: function (e) {
    var addrId = e.currentTarget.dataset.addrid;
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?addrId=' + addrId,
    })
  },

  /**
   * 选择地址 跳转回提交订单页
   */
  selAddrToOrder: function (e) {
    if (this.data.order == 0) {
      var pages = getCurrentPages();//当前页面
      var prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        item: e.currentTarget.dataset.item,
        selAddress: 'yes'
      });
      wx.navigateBack({//返回
        delta: 1
      })
    }
  },
   //删除配送地址
   onDeleteAddr: function (e) {
    var ths = this;
    var addrId = e.currentTarget.dataset.addrid;
    wx.showModal({
      title: '',
      content: '确定要删除此收货地址吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          wx.showLoading();
          var params = {
            url: `/address/${addrId}`,
            method: "DELETE",
            data: {},
            callBack: function (res) {
              wx.hideLoading();
              ths.fetchList()
            }
          }
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})