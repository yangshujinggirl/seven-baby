// pages/prod-classify/prod-classify.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navId: 0,
    orderList: [
      {
        orderId:21,
        orderNo:98098980,
        createTime:'2022-12-09',
        consignee:'zhansgan',
        supplierName:'七个宝宝',
        goodsAmount:401,
        totalAmount:402,
        totalAmount:67,
        orderStatusShow:'已完成',
        promoterAmount:56,
        open:false,
        goods:[{
          goodsName:'儿童奶',
          mainImage:"http://img.qigebaobao.com/oss/admin/2022-11-30/166980782905809453.jpg",
          attrValue:'2罐',
          goodsNum: 2,
          promoterProfit: 29,
          brandProfit: '10%'
        },{
          goodsName:'儿童奶2',
          mainImage:"http://img.qigebaobao.com/oss/admin/2022-11-30/166980782905809453.jpg",
          attrValue:'3罐',
          goodsNum: 3,
          promoterProfit: 40,
          brandProfit: '11%'
        }]
      }
    ],
    current: 1,
    size: 10,
    pages: 0,
    brandList:[],
    currentBrandId:0,
    keywords:'',
    showPop: false,
    sts:'-1'
  },
  openGoodsDetail(e){
    const orderList = this.data.orderList.map((item,i)=>{
      if (i === e.currentTarget.dataset.ind) {
        item.open = !item.open
      }
      return item
    })
    console.log('orderList:', orderList);
    this.setData({
      orderList
    })
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
    this.getProductList()
  },

  getNavPageData() {
    wx.showLoading();
    var params = {
      url: '/promoter/order-filter',
      method: "GET",
      callBack: (res) => {
        const {data, error} = res
        if (error === 0) {
          const { brandList} = data
          this.setData({
            brandList
          })
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
      url: '/promoter/order',
      method: "GET",
      data:{
        keywords:this.data.keywords,
        page: this.data.current,
        brandId: this.data.currentBrandId
      },
      callBack: (res) => {
        let orderList = []
        const {data, error} = res
        if (error === 0) {
          const {current, list, pageTotal} = data
          if (current == 1) {
            orderList = list
          } else {
            orderList = this.data.orderList
            orderList = orderList.concat(list)
          }
          this.setData({
            orderList,
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
  onShareAppMessage: function() {

  }
})