// pages/activity/punchActivity/punchActivity.js
const wxTimer = require('../../../libs/wxTimer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      height: 30,
      callout: {
        content: '华南师范大学',
        color: '#808080FF',
        fontSize: 12,
        borderRadius: 10,
        bgColor: '#7FFFD460',
        padding: 5,
        display: 'ALWAYS'
      },
      label: {
        color: '#808080FF',
        fontSize: 13,
        content: '',
        x: 0, y: 0
      }
    }],
    circles: [{
      latitude: 23.099994,
      longitude: 113.324520,
      color: '#FFFFE0AA',
      fillColor: '#FFFFE0AA',
      radius: 100
    }],
    wxTimerList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let timer = new wxTimer({
      beginTime: "00:00:59",
      complete: function () {
        console.log("完成了")
      }
    });
    this.timer = timer;
    timer.start(this);
    // timer.stop();

  },

  naviToSetting: function (e) {
    wx.navigateTo({
      url: '../settingActivity/settingActivity'
    });
  }


})