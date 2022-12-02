// pages/withdraw-list/withdraw-list.js
var http = require("../../utils/http.js");
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    show:false,
    showDate:false,
    columns:[
      {text:'待审核',defaultIndex:0},
      {text:'审核通过待支付',defaultIndex:1},
      {text:'审核失败',defaultIndex:2},
      {text:'提现成功',defaultIndex:3}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchList()
  },
  fetchList:function(params){
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/promoter-withdraw",
      method: "GET",
      data: {
        page:10,
        ...params
      },
      callBack: function(res) {
        wx.hideLoading();
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
        } else {
          let listArr = res.data.list;
          listArr=[{withdrawStatus:'待支付',withdrawAmount:200,withdrawId:1}]
          ths.setData({ list:listArr })
        }
      }
    };
    http.request(params);
  },
  onFilterType:function(){
    this.setData({ show:true })
  },
  onFilterDate:function(){
    this.setData({ showDate:true })
  },
  onChange:function(e){
    console.log('e')
  },
  onConfirm:function(e){
    const value = e.detail.value||{};
    this.fetchList({auditStatus:value.defaultIndex});
    this.setData({ show:false })
  },
  onCancel:function(e){
    this.setData({ show:false })
  },
  onConfirmDate:function(e){
    let value = e.detail;
    value = moment(value).format('YYYY-MM-DD')
    this.fetchList({withdrawDate:value});
    this.setData({ showDate:false })
  },
  onCancelDate:function(e){
    this.setData({ showDate:false })
  },
  toDetail:function(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/withdraw-detail/withdraw-detail?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})