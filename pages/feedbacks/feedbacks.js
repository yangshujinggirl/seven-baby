// pages/feedbacks/feedbacks.js
var http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    suggest:''
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
    console.log('onShow')
  },
  uoloadFile:function(e) {
    const _this = this;
    wx.chooseMedia({
      success (res) {
        const tempFilePaths = res.tempFiles;
        const file = tempFilePaths[0];
        if(file.size > ( 1024 * 1024 )* 5 ) {
          wx.showToast({
            title: '请上传5M以内文件',
          })
          return;
        }
        wx.uploadFile({
          url: 'https://api.qigebaobao.com/api/common/upload-image', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0].tempFilePath,
          name: 'file',
          header:{
            'Authorization': wx.getStorageSync('token')
          },
          formData: {
            'sourceType': 'member-idcard'
          },
          success (res){
            let data = res.data;
            data = JSON.parse(data);
            let arr = _this.data.images;
            arr.push(data?.data?.imageUrl)
            _this.setData({images:arr})
          },
          fail(error){

          }
        })
      }
    })
  },
  onSubmit:function(val){
    var ths = this;
    const { suggest,images } =this.data;
    wx.showLoading();
    var params = {
      url: "/service/suggest",
      method: "POST",
      data: {
        suggest,
        image:images
      },
      callBack: function(res) {
        wx.hideLoading();
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    };
    http.request(params);
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