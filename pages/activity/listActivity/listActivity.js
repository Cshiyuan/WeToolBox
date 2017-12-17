// listActivity.js

const { getUserActivityListPromise, getUserSignUpActivityListPromise } = require('../../../utils/requestPromise');
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

    if (options.myCreateActivityList) {
      wx.setTopBarText({
        text: '我创建的活动'
      })
      getUserActivityListPromise().then(result => {

        console.log(result);
        let array = result.map(item => {
          item.create_time = item.create_time.slice(0, 10);
          if (item.position !== '') {
            item.position = JSON.parse(item.position);
          } else {
            item.position = {
              // lng: 
              lat: -1,
              lng: -1,
              address: '',
              radius: 0
            }
          }

          return item;
        });
        that.setData({
          activityList: array
        });

      }).then(error => {

      });
    } else {
      wx.setTopBarText({
        text: '我参与的活动'
      });

      getUserSignUpActivityListPromise().then(result => {

        console.log(result);
        let array = result.map(item => {
          item.create_time = item.create_time.slice(0, 10);
          if (item.position !== '') {
            item.position = JSON.parse(item.position);
          } else {
            item.position = {
              // lng: 
              lat: -1,
              lng: -1,
              address: '',
              radius: 0
            }
          }

          return item;
        });
        that.setData({
          activityList: array
        });
      });

    }


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