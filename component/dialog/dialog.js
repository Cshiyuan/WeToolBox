// component/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    placeholder: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _handleButtonClick(e) {
      // console.log(e);
      let type = e.currentTarget.dataset.type;
      console.log(type)
      if (type === undefined) return;
      if (type === 'cancel') {
        var myEventDetail = { value: '' } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('cancel', myEventDetail, myEventOption) // 只会触发 pageEventListener2
        this.hide();
      }
      if (type === 'commit') {
        var myEventDetail = { value: this.data.value } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('commit', myEventDetail, myEventOption) // 只会触发 pageEventListener2
        this.hide();
      }

    },

    _inputValue(e) {
      this.setData({
        value: e.detail.value
      });
    },

    show() {
      this.setData({
        show: true
      });
    },

    hide() {
      this.setData({
        show: false
      })
    }
  }
})
