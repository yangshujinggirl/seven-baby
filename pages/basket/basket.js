// pages/basket/basket.js
var http = require("../../utils/http.js");
// var config = require("../../utils/config.js");
const Big = require("../../utils/big.min.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // picDomain: config.picDomain,
    shopCartItemDiscounts: [],
    finalMoney: 0,
    totalMoney: 0,
    subtractMoney: 0,
    allChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
	  this.loadBasketData();
    http.getCartCount();//重新计算购物车总数量
  },
  
  loadBasketData(){
		wx.showLoading(); //加载购物车
		var params = {
		  url: "/cart",
		  method: "GET",
		  data: {},
		  callBack: res => {
        console.log('res:',res);
        const {error, data} = res
        if (error === 0) {
          const {list} = data
          if (list.length > 0) {
            // 默认不选中
            var shopCartItemDiscounts = list;
            shopCartItemDiscounts.forEach(shopCartItemDiscount => {
              shopCartItemDiscount.goods.forEach(shopCartItem => {
                shopCartItem.checked = false;
                shopCartItem.salePrice = Number(shopCartItem.salePrice)
              });
            });
            this.setData({
              shopCartItemDiscounts: shopCartItemDiscounts,
              allChecked: false
            });
            console.log('shopCartItemDiscounts:', shopCartItemDiscounts);
          } else {
            this.setData({
              shopCartItemDiscounts: []
            });
          }
        }
        this.calTotalPrice(); //计算总价
        wx.hideLoading();
		  }
		};
		http.request(params);
	},

  /**
   * 去结算
   */
  toFirmOrder: function () {
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var basketIds = []
    shopCartItemDiscounts.forEach(shopCartItemDiscount => {
      shopCartItemDiscount.goods.forEach(shopCartItem => {
        if (shopCartItem.checked) {
          basketIds.push({
            goodsId:shopCartItem.goodsId,
            goodsNum: shopCartItem.goodsNum
          })
        }
      })
    })
    if (!basketIds.length) {
      wx.showToast({
        title: '请选择商品',
        icon: "none"
      })
      return
    }
    wx.setStorageSync("basketIds", JSON.stringify(basketIds));
    wx.navigateTo({
      url: '/pages/submit-order/submit-order?orderEntry=0',
    })
  },

  /**
   * 全选
   */
  onSelAll: function () {
    var allChecked = this.data.allChecked;
    allChecked = !allChecked; //改变状态
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;

    for (var i = 0; i < shopCartItemDiscounts.length; i++) {
      var cItems = shopCartItemDiscounts[i].goods;
      for (var j = 0; j < cItems.length; j++) {
        cItems[j].checked = allChecked;
      }
    }
    
    this.setData({
      allChecked: allChecked,
      shopCartItemDiscounts: shopCartItemDiscounts
    });
    this.calTotalPrice();//计算总价
  },

  /**
   * 每一项的选择事件
   */
  onSelectedItem: function (e) {
    var index = e.currentTarget.dataset.index;// 获取data- 传进来的index
    var scindex = e.currentTarget.dataset.scindex;

    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;// 获取购物车列表
    var checked = shopCartItemDiscounts[scindex].goods[index].checked; // 获取当前商品的选中状态
    shopCartItemDiscounts[scindex].goods[index].checked = !checked; // 改变状态
    this.setData({
      shopCartItemDiscounts: shopCartItemDiscounts
    });
    this.checkAllSelected();//检查全选状态
    this.calTotalPrice();//计算总价
  },

  /**
   * 检查全选状态
   */
  checkAllSelected: function () {
    var allChecked = true;
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;

    var flag = false;
    for (var i = 0; i < shopCartItemDiscounts.length; i++) {
      var cItems = shopCartItemDiscounts[i].goods;
      for (var j = 0; j < cItems.length; j++) {
        if (!cItems[j].checked) {
          allChecked = !allChecked;
          flag = true;
          break;
        }
      }
      if(flag){
        break;
      }
    }
    this.setData({
      allChecked: allChecked
    });
  },

  /**
   * 计算购物车总额
   */
  calTotalPrice: function () {
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var totalMoney = 0
    for (var i = 0; i < shopCartItemDiscounts.length; i++) {
      var cItems = shopCartItemDiscounts[i].goods;
      for (var j = 0; j < cItems.length; j++) {
        if (cItems[j].checked) {
          totalMoney += cItems[j].salePrice * cItems[j].goodsNum
        }
      }
    }

    this.setData({
      finalMoney: totalMoney,
      totalMoney: totalMoney,
      subtractMoney: 0
    });

  },

  /**
   * 减少数量
   */
  onCountMinus: function (e) {
    var index = e.currentTarget.dataset.index;
    var scindex = e.currentTarget.dataset.scindex;
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var prodCount = shopCartItemDiscounts[scindex].goods[index].goodsNum;
    if (prodCount > 1) {
      this.updateCount(shopCartItemDiscounts, scindex, index, -1);
    }
  },

  /**
   * 增加数量
   */
  onCountPlus: function (e) {
    var index = e.currentTarget.dataset.index;
    var scindex = e.currentTarget.dataset.scindex;
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var prodCount = shopCartItemDiscounts[scindex].goods[index].goodsNum;
    var goodsStock = shopCartItemDiscounts[scindex].goods[index].goodsStock;
    if (prodCount < goodsStock) {
      this.updateCount(shopCartItemDiscounts, scindex, index, 1);
    }
  },


  /**
   * 改变购物车数量接口
   */
  updateCount: function (shopCartItemDiscounts, scindex, index, prodCount) {
    wx.showLoading({
      mask: true
    });
    const goodsNum = shopCartItemDiscounts[scindex].goods[index].goodsNum + prodCount
    var params = {
      url: "/cart",
      method: "PUT",
      data: {
        goodsNum,
        goodsId: shopCartItemDiscounts[scindex].goods[index].goodsId
      },
      callBack: (res) => {
        if (res.error === 0) {
          shopCartItemDiscounts[scindex].goods[index].goodsNum = goodsNum;
          this.setData({
            shopCartItemDiscounts: shopCartItemDiscounts
          });
          this.calTotalPrice();//计算总价
          wx.hideLoading();
          http.getCartCount();//重新计算购物车总数量
        }
      }
    };
    http.request(params);
  },

  /**
   * 删除购物车商品
   */
  onDelBasket: function () {
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var goodsId = [];
    for (var i = 0; i < shopCartItemDiscounts.length; i++) {
      var cItems = shopCartItemDiscounts[i].goods;
      for (var j = 0; j < cItems.length; j++) {
        if (cItems[j].checked) {
          goodsId.push(cItems[j].goodsId);
        }
      }
    }

    if (basketIds.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: "none"
      })
    } else {
      wx.showModal({
        title: '',
        content: '确认要删除选中的商品吗？',
        confirmColor: "#eb2444",
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              mask: true
            });
            var params = {
              url: "/cart",
              method: "DELETE",
              data: {
                goodsId
              },
              callBack: function (res) {
                wx.hideLoading();
                ths.loadBasketData();
              }
            };
            http.request(params);
          }
        }
      })
    }


  }


})