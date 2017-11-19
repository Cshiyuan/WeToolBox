// pages/activity/setupPosition/setupPosition.js
var bmap = require('../../../libs/bmap-wx.js');
Page({
  data: {
    markers: [{
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      height: 30
    }],
    circles: [{
      latitude: 23.099994,
      longitude: 113.324520,
      color: '#FFFFE0AA',
      fillColor: '#FFFFE0AA',
      radius: 200
    }],
    polyline: [],
    controls: []
  },

  // 绑定input输入 
  bindKeyInput: function (e) {
    let that = this;
    // 新建百度地图对象 
    let BMap = new bmap.BMapWX({
      ak: 'hOfa0G8FQM2LgYxmqSVsu7rUyeS043Np'
    });
    let fail = function (data) {
      console.log(data)
    };
    let success = function (data) {
      console.log(data);
      // var sugData = '';
      // for (var i = 0; i < data.result.length; i++) {
      //   sugData = sugData + data.result[i].name + '\n';
      // }
      // that.setData({
      //   sugData: sugData
      // });
    }
    // 发起suggestion检索请求 
    BMap.suggestion({
      query: e.detail.value,
      fail: fail,
      success: success
    });
  },

  sliderChange: function (e) {
    let value = e.detail.value;
    let circle = this.data.circles[0];
    circle.radius = value;
    this.setData({
      circles: [circle],
    })
    console.log(e);

  },

  markerTap: function (e) {
    console.log(e)
  },
  mapTap: function (e) {
    console.log(e)
  }
})