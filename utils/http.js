var config = require("config.js");

//统一的网络请求方法
function request(params, isGetTonken) {
  // 全局变量
  var globalData = getApp().globalData;
  // 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
  if (!isGetTonken && globalData.isLanding) {
    globalData.requestQueue.push(params);
    return;
  }
  wx.request({
    url: config.domain + params.url, //接口请求地址
    data: params.data,
    header: {
      // 'content-type': params.method == "GET" ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8',
      'Authorization': params.login ? undefined : wx.getStorageSync('token')
    },
    method: params.method == undefined ? "POST" : params.method,
    dataType: 'json',
    responseType: params.responseType == undefined ? 'text' : params.responseType,
    success: function(res) {
      if (res.statusCode == 200) {
        //如果有定义了params.callBack，则调用 params.callBack(res.data)
        if (params.callBack) {
          params.callBack(res.data);
        }

      } else if (res.statusCode == 500) {
        wx.showToast({
          title: "服务器出了点小差",
          icon: "none"
        });
      } else if (res.statusCode == 401) {
        // wx.navigateTo({
        //   url: '/pages/authorization/authorization',
        // })
        // 添加到请求队列
        globalData.requestQueue.push(params);
        // 是否正在登陆
        if (!globalData.isLanding) {
          globalData.isLanding = true
          //重新获取token,再次请求接口
          getToken();
        }
      } else if (res.statusCode == 400) {
        wx.showToast({
          title: res.data,
          icon: "none"
        })

      } else {
        //如果有定义了params.errCallBack，则调用 params.errCallBack(res.data)
        if (params.errCallBack) {
          params.errCallBack(res);
        }
      }
      if (!globalData.isLanding) {
        wx.hideLoading();
      }
    },
    fail: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: "服务器出了点小差",
        icon: "none"
      });
    }
  })
}

//通过code获取token,并保存到缓存
var getToken = function() {
  const globalData = getApp().globalData;
  globalData.userInfo = {};
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      request({
        login: true,
        method: "POST",
        url: '/auth/login',
        data: {
          code: res.code
        },
        callBack: result => {
          // 没有获取到用户昵称，说明服务器没有保存用户的昵称，也就是用户授权的信息并没有传到服务器
          // if (!result.data.user.nickName) {
          //   updateUserInfo();
          // } 
          wx.setStorageSync('token', 'Bearer ' + result.data.user.token); //把token存入缓存，请求接口数据时要用
          globalData.isLanding = false;
          globalData.roleId = result.data.user.roleId;
          globalData.id = result.data.user.id;
          globalData.userInfo = result.data.user;
          while (globalData.requestQueue.length) {
            request(globalData.requestQueue.pop());
          }
        }
      }, true)

    }
  })
}

// 更新用户头像昵称
function updateUserInfo(callback) {
  wx.getUserInfo({
    success: (res) => {
      var userInfo = JSON.parse(res.rawData);
      request({
        url: "/user",
        method: "PUT",
        data: {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          mobile: ''
        },
        callBack:function(res){
          //更新用户信息
          getBaseUserInfo(callback);
        }
      });
    }
  })
}
function updateUserInfoNewVersion(params,callback){
  request({
    url: "/user",
    method: "PUT",
    data: {
      nickname: params.nickname,
      avatar: params.avatar,
      mobile: params.mobile
    },
    callBack:function(res){
      //更新用户信息
      getBaseUserInfo(callback);
    }
  });
}

// 获取用户基本信息
function getBaseUserInfo(callback) {
  request({
    url: "/user",
    method: "GET",
    callBack: function(res) {
      if(!res.error) {
        const  globalData = getApp().globalData;
        globalData.userInfo = res.data?.user;
        callback && callback(res);
      } else {
        wx.showToast({
          title: res.message,
        })
      }
     
    }
  })
}

//获取购物车商品数量
function getCartCount() {
  var params = {
    url: "/cart/count",
    method: "GET",
    data: {},
    callBack: (res) => {
      const {error, data} = res
      if (error === 0) {
        const totalCartCount = data.count.goodsNum
        var app = getApp();
        if (totalCartCount > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: totalCartCount + "",
          })
          app.globalData.totalCartCount = totalCartCount;
        } else {
          wx.removeTabBarBadge({
            index: 2
          })
          app.globalData.totalCartCount = 0;
        }
      }
    }
  };
  request(params);
}


exports.getToken = getToken;
exports.request = request;
exports.getCartCount = getCartCount;
exports.updateUserInfo = updateUserInfo;
exports.getBaseUserInfo = getBaseUserInfo;
exports.updateUserInfoNewVersion = updateUserInfoNewVersion;