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
    province: "",
    city: "",
    area: "",
    provinceItem:{},cityItem:{},areaItem:{},
    // provinceId: 0,
    // cityId: 0,
    // areaId: 0,
    consignee: "",
    mobile: "",
    address: "",
    addrId: 0
  },

  onLoad: function (options) {
    if (options?.addrId) {
      wx.showLoading();
      var params = {
        url: "/p/address/addrInfo/" + options.addrId,
        method: "GET",
        data: {},
        callBack: res => {
          //console.log(res)
          this.setData({
            province: res.province,
            city: res.city,
            area: res.area,
            provinceId: res.provinceId,
            cityId: res.cityId,
            areaId: res.areaId,
            receiver: res.receiver,
            mobile: res.mobile,
            addr: res.addr,
            addrId: options.addrId
          });
          this.initCityData(res.provinceId, res.cityId, res.areaId);
          wx.hideLoading();
        }
      }
      http.request(params);
    } else {
      this.initCityData(this.data.provinceId, this.data.cityId, this.data.areaId);
    }
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
          value:areaindex
        });
        ths.formatArea('prov',areaindex[0]);
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

  /**
   * 根据省份ID获取 城市数据
   */
  getCityArray: function (provinceId, cityId, areaId) {
    var ths = this;
    var params = {
      url: "/common/area-list",
      method: "GET",
      data: {
        pid: provinceId
      },
      callBack: function (res) {
        //console.log(res)
        ths.setData({
          cityArray: res
        });
        if (cityId) {
          for (var index in res) {
            if (res[index].areaId == cityId) {
              ths.setData({
                value: [ths.data.value[0], index, ths.data.value[2]]
              });
            }
          }
        }
        ths.getAreaArray(cityId ? cityId : res[0].areaId, areaId);
        wx.hideLoading();
      }
    }
    http.request(params);
  },

  /**
    * 根据城市ID获取 区数据
    */
  getAreaArray: function (cityId, areaId) {
    var ths = this;
    var params = {
      url: "/p/area/listByPid",
      method: "GET",
      data: {
        pid: cityId
      },
      callBack: function (res) {
        //console.log(res)
        ths.setData({
          areaArray: res
        });
        if (areaId) {

          for (var _index in res) {
            if (res[_index].areaId == areaId) {
              ths.setData({
                value: [ths.data.value[0], ths.data.value[1], _index]
              });
            }
          }

          index = ths.data.value;

          ths.setData({
            province: ths.data.province,
            city: ths.data.city,
            area: ths.data.area,
            provinceId: ths.data.provinceId,
            cityId: ths.data.cityId,
            areaId: ths.data.areaId
          })

        } else {
          ths.setData({
            province: ths.data.provArray[ths.data.value[0]].areaName,
            city: ths.data.cityArray[ths.data.value[1]].areaName,
            area: ths.data.areaArray[ths.data.value[2]].areaName,
            provinceId: ths.data.provArray[ths.data.value[0]].areaId,
            cityId: ths.data.cityArray[ths.data.value[1]].areaId,
            areaId: ths.data.areaArray[ths.data.value[2]].areaId
          })
        }

        wx.hideLoading();
      }
    }
    http.request(params);
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
    const { consignee, mobile, address,provinceItem,cityItem,areaItem } =ths.data;
    if (!consignee) {
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
    if (!address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return;
    }

    wx.showLoading();
    var url = "/address";
    var method = "POST";
    if (ths.data.addrId != 0) {
      url = "/p/address/updateAddr";
      method = "PUT";
    }
    //添加或修改地址
    var params = {
      url: url,
      method: method,
      data: {
        consignee,
        mobile,
        address,
        provinceId: provinceItem.adcode,
        cityId: cityItem.adcode,
        districtId: areaItem.adcode,
      },
      callBack: function (res) {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        })
      }
    }
    http.request(params);
  },
  tskl:function(){
    console.log('qwwwwww')
  },

  onReceiverInput: function (e) {
    console.log('e',e)
    // this.setData({
    //   receiver: e.detail.value
    // });
  },

  onMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  onAddrInput: function (e) {
    this.setData({
      addr: e.detail.value
    });
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
            url: "/p/address/deleteAddr/" + addrId,
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

})