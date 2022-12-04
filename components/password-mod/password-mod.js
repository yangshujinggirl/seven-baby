// components/password-mod/password-mod.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onSubmit:Function,
    onClose:Function,
    type:String,
    withdrawAmount:Number,
  },
  externalClasses:['parent-class'],
  /**
   * 组件的初始数据
   */
  data: {
    Length: 6, //输入框个数
    isFocus: false, //聚焦 唤起键盘
    Value: "", //输入的密码内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
    disabled: true,//下一步按钮可否可点击
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel(){
      that.triggerEvent('onClose')
    },
    Focus(e) {
      console.log(this.data)
      var that = this;
      var inputValue = e.detail.value;
      var ilen = inputValue.length;
      if (ilen == 6) {
        that.setData({
          disabled: false,
        })
        that.triggerEvent('onSubmit',inputValue)
      } else {
        that.setData({
          disabled: true,
        })
      }
      that.setData({
        Value: inputValue,
      })
    },
    Tap() {
      var that = this;
      that.setData({
        isFocus: true,
      })
    },
  }
})
