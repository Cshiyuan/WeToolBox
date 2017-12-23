// component/asynSwitch/asynSwitch.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
    },
    // myProperty2: String // 简化的定义方式
  },

  /**
   * 组件的初始数据
   */
  data: {
    disabled: false,
    loading: false,
    checked: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //内部事件触发
    _handleSwitchChange(e) {

      //如果加载中，或者disable了就直接停止
      if (this.data.loading || this.data.disabled) {
        return;
      }
      let checked = !this.data.checked;
      this.setData({
        loading: true
      });

      var myEventDetail = { value: checked } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('switch', myEventDetail, myEventOption) // 只会触发 pageEventListener2

    },

    //调整确认状态
    setSwitchStatus(checked) {
      this.setData({
        loading: false,
        checked: checked
      });
    }

  }
})
