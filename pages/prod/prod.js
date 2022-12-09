// pages/prod/prod.js
const app = getApp()
var http = require('../../utils/http.js');
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: 1,
    picDomain: config.picDomain,
    indicatorDots: true,
    indicatorColor: '#f2f2f2',
    indicatorActiveColor: '#eb2444',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    prodNum: 1,
    totalCartNum: 0,
    pic: "",
    content: '',
    prodId: 0,
    promoteId: undefined,
    skuId: 0,
    popupShow: false,
    // 是否获取过用户领取过的优惠券id
    loadCouponIds: false,
    skuShow: false,
    commentShow: false,
    couponList: [],
    skuList: [],
    skuGroup: {},
    findSku: true,
    defaultSku: undefined,
    selectedProp: [],
    selectedPropObj: {},
    propKeys: [],
    allProperties: [],
    prodCommData: {},
    prodCommPage: {
      current: 0,
      pages: 0,
      records: []
    },
    littleCommPage: [],
    evaluate: -1,
    isCollection: 0,
    userId:NaN,
    roleId:1,
    isCommission: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      prodId: options.prodid
    });
    if (options.inviteId) {
      this.setData({
        promoteId: options.inviteId
      });
    }
    // 加载商品信息
    this.getProdInfo();
  },

  /**
   * 添加或者取消收藏商品 
   */
  addOrCannelCollection() {
    wx.showLoading();
    var params = {
      url: `/goods/${this.data.prodId}/collect`,
      method: "PUT",
      data: {
        collect: this.data.isCollection?0:1
      },
      callBack: (res) => {
        this.setData({
          isCollection: this.data.isCollection?0:1
        })
        wx.hideLoading();
      }
    };
    http.request(params);
  },

  // 获取商品信息
  getProdInfo() {
    wx.showLoading();
    var params = {
      url: `/goods/${this.data.prodId}`,
      method: "GET",
      callBack: (res) => {
        const {error, data} = res
        if (error===0) {
          const { attributeList, goodsItem, isCollection, roleId, userId } = data
          var content = util.formatHtml(goodsItem.goodsDetails);
          this.setData({
            goodsItem,
            content: content,
            prodId: goodsItem.goodsId,
            isCollection:isCollection,
            roleId,
            userId,
            skuList: attributeList,
            pic: goodsItem.carouselImage[0]
          })
          this.groupSkuProp()
          //绑定关系
          setTimeout(()=>{
            if (this.data.promoteId) {
              this.bindPromoteRelation(userId)
            }
          },1000)
        }
        // // 组装sku
        wx.hideLoading();
      }
    };
    http.request(params);
  },
  /**
   * 绑定关系
   */
  bindPromoteRelation() {
    var params = {
      url: '/promoter/invitation',
      method: "POST",
      data:{
        invitationId: this.data.promoteId
      },
      callBack: (res) => {
        setTimeout(()=>{
          wx.showToast({
            title: `inviteId:${this.data.promoteId};${res.message}`,
            icon: '',
            duration: 2000
          })
        },3000)
      }
    };
    http.request(params);
  },
  /**
   * 根据skuList进行数据组装
   */
  groupSkuProp: function() {
    var skuList = this.data.skuList;

    //当后台返回只有一个SKU时，且SKU属性值为空时，即该商品没有规格选项，该SKU直接作为默认选中SKU
    // if (skuList.length == 1) {
    //   this.setData({
    //     defaultSku: skuList[0]
    //   });
    //   return;
    // }

    var skuGroup = {};//所有的规格名(包含规格名下的规格值集合）对象，如 {"颜色"：["金色","银色"],"内存"：["64G","256G"]}
    var allProperties = [];//所有SKU的属性值集合，如 ["颜色:金色;内存:64GB","颜色:银色;内存:64GB"]
    var propKeys = [];//所有的规格名集合，如 ["颜色","内存"]

    for (var i = 0; i < skuList.length; i++) {

      //找到和商品价格一样的那个SKU，作为默认选中的SKU
      var defaultSku = this.data.defaultSku;
      var isDefault = false;
      if (!defaultSku && skuList[i].salePrice == this.data.goodsItem.price) { 
        defaultSku = skuList[i];
        isDefault = true;
        this.setData({
          defaultSku: defaultSku
        });
      }

      var properties = `规格:${skuList[i].attrValue}`; //如：版本:公开版;颜色:金色;内存:64GB
      allProperties.push(properties);
      var propList = properties.split(";"); // 如：["版本:公开版","颜色:金色","内存:64GB"]

      var selectedPropObj = this.data.selectedPropObj;
      for (var j = 0; j < propList.length; j++) {
        var propval = propList[j].split(":"); //如 ["版本","公开版"]
        var props = skuGroup[propval[0]]; //先取出 规格名 对应的规格值数组
        //如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
        if (isDefault) {
          propKeys.push(propval[0]);
          selectedPropObj[propval[0]] = propval[1];
        }
        if (props == undefined) {
          props = []; //假设还没有版本，新建个新的空数组
          props.push(propval[1]); //把 "公开版" 放进空数组
        } else {
          if (!this.array_contain(props, propval[1])) { //如果数组里面没有"公开版"
            props.push(propval[1]); //把 "公开版" 放进数组
          }
        }
        skuGroup[propval[0]] = props; //最后把数据 放回版本对应的值
      }
      this.setData({
        selectedPropObj: selectedPropObj,
        propKeys: propKeys
      });
    }
    this.parseSelectedObjToVals();
    this.setData({
      skuGroup: skuGroup,
      allProperties: allProperties
    });
  },

  //将已选的 {key:val,key2:val2}转换成 [val,val2]
  parseSelectedObjToVals: function() {
    var selectedPropObj = this.data.selectedPropObj;
    var selectedProperties = "";
    var selectedProp = [];
    for (var key in selectedPropObj) {
      selectedProp.push(selectedPropObj[key]);
      selectedProperties += key + ":" + selectedPropObj[key] + ";";
    }
    selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1);
    this.setData({
      selectedProp: selectedProp
    });

    var findSku = false;
    for (var i = 0; i < this.data.skuList.length; i++) {
      if (this.data.skuList[i].attrValue == selectedProp[0] && this.data.skuList[i].goodsStock) {
        findSku = true;
        this.setData({
          defaultSku: this.data.skuList[i],
        });
        break;
      }
    }
    this.setData({
      findSku: findSku
    });
  },

  //点击选择规格
  toChooseItem: function(e) {
    var val = e.currentTarget.dataset.val;
    var key = e.currentTarget.dataset.key;
    var selectedPropObj = this.data.selectedPropObj;
    selectedPropObj[key] = val;
    this.setData({
      selectedPropObj: selectedPropObj
    });
    this.parseSelectedObjToVals();
  },

  //判断数组是否包含某对象
  array_contain: function(array, obj) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
        return true;
    }
    return false;
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
    this.setData({
      totalCartNum: app.globalData.totalCartCount
    });
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
   * 跳转到首页
   */
  toHomePage: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 跳转到购物车
   */
  toCartPage: function() {
    wx.switchTab({
      url: '/pages/basket/basket',
    })
  },

  /**
   * 加入购物车
   */
  addToCart: function(event) {
    if (this.data.goodsItem.inSale == 0) {
      wx.showToast({
        title: '该商品已下架',
        icon: '',
        duration: 2000
      })
    } else {
      if (!this.data.findSku) {
        return;
      }
      var ths = this;
      wx.showLoading({
        mask: true
      });
      var params = {
        url: "/cart",
        method: "POST",
        data: {
          goodsId: this.data.defaultSku.attrId,
          goodsNum: this.data.prodNum
        },
        callBack: function(res) {
          //console.log(res);
          const {error, data, message} = res
          if (error === 0) {
            // TODO
            ths.setData({
              totalCartNum: ths.data.totalCartNum + ths.data.prodNum
            });
            wx.showToast({
              title: "加入购物车成功",
              icon: "none"
            })
          } else {
            wx.showToast({
              title: message,
              icon: "none"
            })
          }
          wx.hideLoading();
        }
      };
      http.request(params);
    }
  },

  /**
   * 立即购买
   */
  buyNow: function() {
    if (this.data.goodsItem.inSale == 0) {
      wx.showToast({
        title: '该商品已下架',
        icon: '',
        duration: 2000
      })
    } else {
      if (!this.data.findSku) {
        return;
      }
      wx.setStorageSync("orderItem", JSON.stringify([{
        goodsId:this.data.defaultSku.attrId,
        goodsNum:this.data.prodNum
      }]));
      wx.navigateTo({
        url: '/pages/submit-order/submit-order?orderEntry=1',
      })
    }
  },

  /**
   * 减数量
   */
  onCountMinus: function() {
    var prodNum = this.data.prodNum;
    if (prodNum > 1) {
      this.setData({
        prodNum: prodNum - 1
      });
    }
  },

  /**
   * 加数量
   */
  onCountPlus: function() {
    var prodNum = this.data.prodNum;
    if (prodNum < 1000) {
      this.setData({
        prodNum: prodNum + 1
      });
    }
  },

  /**
   * 分享设置
   */
  onShareAppMessage: function(res) {
    return {
      title: this.data.goodsItem.goodsName,
      imageUrl: this.data.pic,
      path: `/pages/prod/prod?prodid=${this.data.prodId}&inviteId=${this.data.userId}`,
      success: (res) => {
        console.log(res)
        // 分享成功
      },
      fail: (res) => {
        console.log(res)
        // 分享失败
      }
    }
  },

  showPopup: function() {
    if (this.data.loadCouponIds) {
      this.setData({
        popupShow: true
      });
      return;
    }
    http.request({
      url: "/p/myCoupon/listCouponIds",
      method: "GET",
      data: {},
      callBack: (couponIds) => {
        var couponList = this.data.couponList;
        console.log(couponList)

        couponList.forEach(coupon => {
          if (couponIds && couponIds.length) {
            // 领取该优惠券数量
            var couponLimit = 0;
            couponIds.forEach(couponId => {
              if (couponId == coupon.couponId) {
                couponLimit++;
              }
            });
            // 小于用户领取优惠券上限，可以领取优惠券
            if (couponLimit < coupon.limitNum) {
              coupon.canReceive = true;
            } else {
              coupon.canReceive = false;
            }
          } else {
            coupon.canReceive = true;
          }
        });
        this.setData({
          couponList: couponList,
          popupShow: true,
          loadCouponIds: true
        })
      }
    })
  },
  showSku: function() {
    const { userInfo } =app.globalData;
    if(!userInfo.nickname) {
      wx.navigateTo({
          url: '/pages/authorization/authorization',
      })
      return;
    }
    this.setData({
      skuShow: true
    });
  },
  showComment: function() {
    this.setData({
      commentShow: true
    });
  },

  closePopup: function() {
    this.setData({
      popupShow: false,
      skuShow: false,
      commentShow: false
    });
  },



})