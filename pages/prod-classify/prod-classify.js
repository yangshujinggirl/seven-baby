// pages/prod-classify/prod-classify.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navId: 0,
    prodList: [],
    title: "",
    current: 1,
    size: 10,
    pages: 0,
    banner:'',
    bannerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      current: 1,
      pages: 0,
      navId: options.tagid,
      title: options.title ? options.title : ""
    });
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.loadProdData(options.tagid);

  },

  /**
   * 加载商品数据
   */
  loadProdData: function(id) {
    this.getNavPageData(id)
    // let sts = this.data.sts
    // if (sts == 0) {
    //   // 分组标签商品列表
    //   this.getTagProd();
    // } else if (sts == 1) {
    //   // 新品推荐
    //   let url = "/prod/lastedProdPage"
    //   this.getActProd(url)
    // } else if (sts == 2) {
    //   // 限时特惠
    //   let url = "/prod/discountProdList"
    //   this.getActProd(url)
    // } else if (sts == 3) {
    //   // 每日疯抢
    //   let url = "/prod/moreBuyProdList"
    //   this.getActProd(url)
    // } else if (sts == 4) {
    //   // 优惠券商品列表
    //   this.getProdByCouponId(options.tagid)
    // } else if (sts == 5) {
    //   // 收藏商品列表
    //   this.getCollectionProd()
    // }
  },

  getNavPageData(id) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/index/${id}/goods-brand`,
      method: "GET",
      data: {
        current: ths.data.current,
        size: ths.data.size,
      },
      callBack: function(res) {
        console.log('res:', res);
        const {data, error} = res
        if (error === 0) {
          const {banner, bannerList} = data
          ths.setData({
            banner,
            bannerList
          })
          if(bannerList.length){
            this.getProductList()
          }
        }
        // let list = []
        // if (res.current == 1) {
        //   list = res.records
        // } else {
        //   list = ths.data.prodList
        //   list = list.concat(res.records)
        // }
        // ths.setData({
        //   prodList: list,
        //   pages: res.pages
        // });
        wx.hideLoading();
      }
    };
    http.request(params);
  },

  getProductList(){
    
  },

  getActProd: function(url) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: url,
      method: "GET",
      data: {
        current: ths.data.current,
        size: ths.data.size,
      },
      callBack: function(res) {
        let list = []
        if (res.current == 1) {
          list = res.records
        } else {
          list = ths.data.prodList
          list = list.concat(res.records)
        }
        ths.setData({
          prodList: list,
          pages: res.pages
        });
        wx.hideLoading();
      }
    };
    http.request(params);
  },

  /**
   * 获取我的收藏商品
   */
  getCollectionProd: function() {
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/p/user/collection/prods",
      method: "GET",
      data: {
        current: ths.data.current,
        size: ths.data.size,
      },
      callBack: function(res) {

        let list = []
        if (res.current == 1) {
          list = res.records
        } else {
          list = ths.data.prodList
          list = list.concat(res.records)
        }
        ths.setData({
          prodList: list,
          pages: res.pages
        });
        wx.hideLoading();
      }
    };
    http.request(params);
  },

  /**
   * 获取标签列表
   */
  getTagProd: function(id) {
    var ths = this;
    wx.showLoading();
    var param = {
      url: "/prod/prodListByTagId",
      method: "GET",
      data: {
        tagId: ths.data.tagid,
        current: ths.data.current,
        size: ths.data.size
      },
      callBack: (res) => {
        let list = []
        if (res.current == 1) {
          list = res.records
        } else {
          list = ths.data.prodList.concat(res.records)
        }
        ths.setData({
          prodList: list,
          pages: res.pages
        });
        wx.hideLoading();
      }
    };
    http.request(param);
  },

  /**
   * 获取优惠券商品列表
   */
  getProdByCouponId(id) {
    var ths = this;
    wx.showLoading();
    var param = {
      url: "/coupon/prodListByCouponId",
      method: "GET",
      data: {
        couponId: id,
        current: this.data.current,
        size: this.data.size
      },
      callBack: (res) => {
        let list = []
        if (res.current == 1) {
          list = res.records
        } else {
          list = ths.data.prodList.concat(res.records)
        }
        ths.setData({
          prodList: list,
          pages: res.pages
        });
        wx.hideLoading();
      }
    };
    http.request(param);
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
      this.setData({
        current: this.data.current + 1
      })
      this.loadProdData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})