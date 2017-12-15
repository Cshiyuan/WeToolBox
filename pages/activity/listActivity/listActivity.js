// listActivity.js

const { getUserActivityListPromise } = require('../../../utils/requestPromise');
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    getUserActivityListPromise().then(result => {

      console.log(result);
      that.setData({
        activityList: result
      });

    }).then(error => {

    });
  },

  /**
   * 跳转到活动页面
   */
  naviToActivity: function (e) {

    console.log(e);
    let activityIndex = e.currentTarget.dataset.index;
    let activity_id = this.data.activityList[activityIndex].activity_id;
    if (activity_id) {
      let url = '/pages/activity/punchActivity/punchActivity';
      let param = util.generateNaviParam({
        activity_id: activity_id
      });

      wx.navigateTo({
        url: url + param
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})