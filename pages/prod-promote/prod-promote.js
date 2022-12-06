// pages/prod-classify/prod-classify.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBrandId: 0,
    currentCategoryId: 0,
    navId: 0,
    prodList: [],
    current: 1,
    size: 10,
    pages: 0,
    banner:'',
    brandList:[],
    currentBrandId:0,
    categoryList:[],
    currentCategoryId: 0,
    keywords:'',
    showPop: false
  },
  changeCategoryId(e) {
    this.setData({
      currentCategoryId: e.target.dataset.id === this.data.currentCategoryId?0:e.target.dataset.id
    })
  },
  changeBrandId(e){
    this.setData({
      currentBrandId: e.target.dataset.id === this.data.currentBrandId?0:e.target.dataset.id
    })
  },
  //输入商品名获取数据 || 绑定输入值
  getSearchContent:function(e){
    this.setData({
      keywords: e.detail.value
    })
    // this.data.prodName=e.detail.value
  },

  searchProduct() {
    this.setData({
      current: 1,
      page:0
    })
    this.getProductList()
  },
  searchPro() {
    this.setData({
      current: 1,
      page:0,
      showPop: false
    })
    this.getProductList()
  },
  onClose() {
    this.setData({ showPop: false });
  },
  showPopUp() {
    this.setData({ showPop: true });
  },
  goProduct: function (e) {
    var prodid = e.currentTarget.dataset.prodid;
    wx.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid,
    })
  },
  share(){
    console.log('阻止事件冒泡');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      current: 1,
      pages: 0,
      currentBrandId: 0,
      currentCategoryId: 0
    });
    this.getNavPageData()
  },

  getNavPageData() {
    wx.showLoading();
    var params = {
      url: '/promoter/goods-filter',
      method: "GET",
      callBack: (res) => {
        const {data, error} = res
        if (error === 0) {
          const {banner, brandList, categoryList} = data
          this.setData({
            banner,
            brandList,
            categoryList
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
      url: '/promoter/goods',
      method: "GET",
      data:{
        keywords:this.data.keywords,
        page: this.data.current,
        brandId: this.data.currentBrandId,
        categoryId: this.data.currentCategoryId
      },
      callBack: (res) => {
        let prodList = []
        const {data, error} = res
        if (error === 0) {
          const {current, list, pageTotal} = data
          if (current == 1) {
            prodList = list
          } else {
            prodList = this.data.prodList
            prodList = prodList.concat(list)
          }
          this.setData({
            prodList,
            current:parseInt(current),
            pages: current == 1 ? pageTotal : this.data.pages
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
  onShareAppMessage(e) {
    const prodid= e.target?.dataset?.id;
    return {
      title: '我的商品',
      path: '/pages/prod/prod?prodid=' + prodid,
      imageUrl: '../../images/customer/pic.png',
      success: (res) => {
        // 分享成功
      },
      fail: (res) => {
        // 分享失败
      }
    }
  },
})