// pages/activity/settingActivity/settingActivity.js
const { deleteActivityPromise } = require('../../../utils/requestPromise');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let activity_id = options.activity_id;
    if (activity_id) {
      this.setData({
        activity_id: activity_id
      });
    }

  },

  deleteActivity: function (e) {

    let that = this;
    deleteActivityPromise({

      activity_id: this.data.activity_id
    }).then(result => {
      console.log(result);
      if (result.ret == 1) {
        let pageStacks = getCurrentPages();
        // console.log(pageStacks);
        let listPage = pageStacks[pageStacks.length - 3];
        console.log(listPage);
        if (listPage.route === 'pages/activity/listActivity/listActivity' && listPage.data.activityList) {

          //将列表中对应项目删除
          let activityList = listPage.data.activityList;
          for (let i = 0; i < activityList.length; i++) {
            if (activityList[i].activity_id === that.data.activity_id) {
              activityList.splice(i, 1);
              break;
            }
          }
          listPage.setData({
            activityList: activityList
          });

        }
        wx.navigateBack({  //返回两次
          delta: 2
        })

      } else {

      }

    }).catch(err => {
      console.log(err);
    });

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