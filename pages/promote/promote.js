// pages/editAddress/editAddress.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var areaindex = [10, 0, 0];

var t = 0;
var show = false;
var moveY = 200;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: [0, 0, 0],
    provArray: [],
    cityArray: [],
    areaArray: [],
    provinceItem:{},cityItem:{},areaItem:{},
    truename: "",
    mobile: "",
    detailAddress: "",
    isChecked:0,
    idCardFront:'',
    idCardBack:''
  },

  onLoad: function (options) {
    if (options?.addrId) {
      wx.showLoading();
      this.setData({addrId:options?.addrId})
      this.fetchInfo(options?.addrId)
    }
    this.initCityData();
  },

  initCityData: function (provinceId, cityId, areaId) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/common/area-list",
      method: "GET",
      callBack: function (res) {
        const { data } =res;
        ths.setData({
          provArray: data?.areaList,
        });
        ths.formatArea('prov',0);
        wx.hideLoading();
      }
    }
    http.request(params);
  },
  //地址详情
  fetchInfo: function (id) {
    var ths = this;
    wx.showLoading();
    var params = {
      url: `/address/${id}`,
      method: "GET",
      callBack: function (res) {
        const { data } =res;
        const vals = {
          ...data,
          provinceItem:{name:data.provinceName,adcode:data.provinceId},
          cityItem:{name:data.cityName,adcode:data.cityId},
          areaItem:{name:data.districtName,adcode:data.districtId},
        }
        ths.setData(vals);
        wx.hideLoading();
      }
    }
    http.request(params);
  },

  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {

  },
  switchChange:function(e){
    console.log('3')
    this.setData({isChecked:!this.data.isChecked})
  },
  //滑动事件
  bindChange: function (e) {
    var ths = this;
    var val = e.detail.value;
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (areaindex[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      this.formatArea('prov',val[0]);
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (areaindex[1] != val[1]) {
        val[2] = 0;
        this.formatArea('city',val[1]);
      } 
    }
    areaindex = val;
    this.setData({
      value: val,
    })
  },
  formatArea:function(areaType,index){
    const { provArray, cityArray, areaArray,provinceItem,cityItem,areaItem } =this.data;
    let cityArr = cityArray,areaArr = areaArray;
    if(areaType === 'prov') {
      let proItem = provArray[index];
      cityArr = proItem.city;
      areaArr = cityArr[0].district;
    }else if(areaType === 'city') {
      let cityItem = cityArray[index];
      areaArr = cityItem.district;
    }
    this.setData({
      cityArray:cityArr,
      areaArray:areaArr,
    })
  },
  //确定选中地址
  onSelectArea:function(areaType,index){
    const { provArray, cityArray, areaArray,value } =this.data;
    this.setData({
      provinceItem:provArray[value[0]],
      cityItem:cityArray[value[1]],
      areaItem:areaArray[value[2]],
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    this.setData({
      show: true
    });
    // this.animation.translate(arr[0], arr[1]).step();
    this.animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log('hiddenFloatView',e);
    moveY = 200;
    show = true;
    t = 0;
    this.animationEvents(this, moveY, show);
    this.onSelectArea()
  },

  //动画事件
  animationEvents: function (that, moveY, show) {
    //console.log("moveY:" + moveY + "\nshow:" + show);
    that.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    }
    )
    that.animation.translateY(moveY + 'vh').step()

    that.setData({
      animation: that.animation.export()
    })

  },
  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 保存地址
   */
  onSaveAddr: function () {
    var ths = this;
    const { truename, mobile, detailAddress,idCardFront, idCardBack, advantage,provinceItem,cityItem,areaItem } =ths.data;
    if (!truename) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: "none"
      })
      return;
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
      return;
    }
    var regexp = /^[1]([3-9])[0-9]{9}$/;
    if (!regexp.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none"
      })
      return;
    }
    if (!detailAddress) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return;
    }

    wx.showLoading();
    var url = "/promoter";
    var method = "POST";
    //添加或修改地址
    var params = {
      url: url,
      method: method,
      data: {
        truename, 
        mobile, 
        detailAddress,
        idCardFront, 
        idCardBack, 
        advantage,
        provinceId: provinceItem.adcode,
        cityId: cityItem.adcode,
        districtId: areaItem.adcode,
      },
      callBack: function (res) {
        if(res.error) {
          wx.showToast({
            title: res.message,
          })
        } else {
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        }
        
      }
    }
    http.request(params);
  },
   //删除配送地址
  onDeleteAddr: function (e) {
    var ths = this;
    wx.showModal({
      title: '',
      content: '确定要删除此收货地址吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          var addrId = ths.data.addrId;
          wx.showLoading();
          var params = {
            url: `/address/${addrId}`,
            method: "DELETE",
            data: {},
            callBack: function (res) {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })
            }
          }
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  uoloadFile:function(e) {
    const _this = this;
    const  card = e.currentTarget.dataset.card;
    wx.chooseMedia({
      success (res) {
        const tempFilePaths = res.tempFiles
        wx.uploadFile({
          url: 'https://api.qigebaobao.com/api/common/upload-image', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0].tempFilePath,
          name: 'file',
          formData: {
            'sourceType': 'member-idcard'
          },
          success (res){
            let data = res.data;
            data = JSON.parse(data);
            console.log('card1',res)
            _this.setData({[card]:data.data?.imageUrl})
          }
        })
      }
    })
  }
})