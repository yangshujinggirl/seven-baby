// pages/prod-classify/prod-classify.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBrandId: 0,
    navId: 0,
    prodList: [{
      goodsId:1,
      inSale:1,
      goodsName:1,
      mainImage:1,
      retailPrice:1,
      salePrice:1,
    },{
      goodsId:2,
      inSale:0,
      goodsName:'飞鹤星飞帆2段罐装幼儿精装牛奶粉',
      mainImage:1,
      retailPrice:200,
      salePrice:168,
    }],
    title: "",
    current: 1,
    size: 10,
    pages: 0,
    contentList:[]
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
    this.getProductList()
  },

  changetab(e){
    const {id} = e.currentTarget.dataset
    this.setData({
      currentBrandId: id,
    })
    this.getProductList()
  },


  getNavPageData() {
    wx.showLoading();
    var params = {
      url: `/index/${this.data.navId}/goods-brand`,
      method: "GET",
      callBack: (res) => {
        const {data, error} = res
        if (error === 0) {
          const {banner, brandList} = data
          this.setData({
            banner,
          })
          if(brandList.length){
            this.getProductList()
          }
        }
        wx.hideLoading();
      }
    };
    http.request(params);
  },
  // 获取商品列表
  getProductList(){
    wx.showLoading();
    var params = {
      url: `/user/goods-collection`,
      method: "GET",
      data: {
        page: 100,
      },
      callBack: (res) => {
        let prodList = []
        const {data, error} = res
        if (error === 0) {
          const {current, list, pageTotal} = data
          // this.setData({
          //   prodList:list,
          // });
        }
        wx.hideLoading();
      }
    };
    http.request(params);
  },
   // 获取内容列表
  getContentList(){
    wx.showLoading();
    var params = {
      url: `/user/community-collection`,
      method: "GET",
      data: {
        page: 100,
      },
      callBack: (res) => {
        let prodList = []
        const {data, error} = res
        if (error === 0) {
          const {current, list, pageTotal} = data
          this.setData({
            contentList:list,
          });
        }
        wx.hideLoading();
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
      this.getProductList(this.data.currentBrandId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})