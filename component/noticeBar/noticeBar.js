Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
    },
    // myProperty2: String // 简化的定义方式
  },
  data: {
    content: ''
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },
  moved: function () { },
  detached: function () { },

  methods: {

    setContent(content = '', options = {}) {

      let that = this;
      this.setData({
        content: content
      });
      this.currentComponent = {};
      let currentComponent = this.currentComponent;

      this.createSelectorQuery().select('#content').boundingClientRect(function (rect) {

        if (rect.width) {

          currentComponent.width = rect.width;
          that.createSelectorQuery().select('#content-wrap').boundingClientRect(function (rect) {
            currentComponent.wrapWidth = rect.width;
            if (currentComponent.wrapWidth < currentComponent.width) {

              let mstime = currentComponent.width / 40 * 1000; //计算滚动速度
              currentComponent.animation = wx.createAnimation({
                duration: mstime,
                timingFunction: 'linear'
              });
              currentComponent.resetAnimation = wx.createAnimation({
                duration: 0,
                timingFunction: 'linear'
              });
              that._scrollNoticeBar(mstime);
            }

          }).exec();
        }
      }).exec();

    },

    _scrollNoticeBar: function (mstime) {
      let currentComponent = this.currentComponent;
      let resetAnimation = currentComponent.resetAnimation.translateX(currentComponent.wrapWidth).step();

      //重置
      this.setData({
        animationData: resetAnimation.export()
      });
      //-mstime * 40 / 1000 是还原计算出宽度了。
      let aninationData = currentComponent.animation.translateX(-mstime * 40 / 1000).step();

      let that = this;

      setTimeout(function () {
        that.setData({
          animationData: aninationData.export()
        });
      }, 100);

      setTimeout(function () {
        that._scrollNoticeBar(mstime);
      }, mstime);
    },

  }

})