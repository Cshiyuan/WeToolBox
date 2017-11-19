// pages/activity/publishActivity/publishActivity.js
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    description: '',
    date: "2016-09-01",
    time: "12:01",
    toDay: "",
    nowTime: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myDateString = util.formatTime(new Date());
    let toDay = myDateString.split(' ')[0].replace(new RegExp('/', "gm"), '-');
    let nowTime = myDateString.split(' ')[1].substring(0, 5);
    // console.log(toDay);
    this.setData({
      toDay: toDay,
      nowTime: nowTime,
      date: toDay,
      time: nowTime
    });

  },

  toSetUpPosition: function (e) {
    wx.navigateTo({
      url: '../setupPosition/setupPosition'
    });
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },


  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },



})