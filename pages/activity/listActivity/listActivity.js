// listActivity.js

const { getUserActivityListPromise, getUserSignUpActivityListPromise } = require('../../../utils/requestPromise');
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    loading: false,
    end: 0,   //请求参数
    length: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.myCreateActivityList) {

      wx.setTopBarText({
        text: '我创建的活动'
      })
      this.setData({
        title: '我创建的活动'
      });
      this.refreshListForMyActivity();

    } else {

      wx.setTopBarText({
        text: '我参与的活动'
      });
      this.setData({
        title: '我参与的活动'
      });
      this.refreshListForMySignUpActivity();

    }
  },

  refreshListForMyActivity: function () {

    let that = this;
    this.setData({
      loading: true
    });
    getUserActivityListPromise({
      start: this.data.end,  //分页查询
      length: this.data.length
    }).then(result => {

      console.log(result);
      let array = result.map(item => {
        item.create_time = util.formatTime(new Date(item.create_time));
        // console.log(item.create_time);
        // item.create_time = item.create_time.slice(0, 10);
        if (item.position !== '') {
          item.position = JSON.parse(item.position);
        } else {
          item.position = {
            lat: -1,
            lng: -1,
            address: '',
            radius: 0
          }
        }

        return item;
      });
      that.setData({
        activityList: that.data.activityList.concat(array),
        end: that.data.end + that.data.length,
        loading: false
      });

    }).catch(error => {
      console.log('error is ');
      console.log(error);
      that.setData({
        loading: false
      });
      util.showFailToast();
    });

  },

  refreshListForMySignUpActivity: function () {

    let that = this;
    this.setData({
      loading: true
    });
    getUserSignUpActivityListPromise({
      start: this.data.end,  //分页查询
      length: this.data.length
    }).then(result => {

      console.log(result);
      let array = result.map(item => {
        item.create_time = util.formatTime(new Date(item.create_time));
        if (item.position !== '') {
          item.position = JSON.parse(item.position);
        } else {
          item.position = {
            lat: -1,
            lng: -1,
            address: '',
            radius: 0
          }
        }

        return item;
      });
      that.setData({
        activityList: that.data.activityList.concat(array),
        end: that.data.end + that.data.length,
        loading: false
      });
    }).catch(error => {
      that.setData({
        loading: false
      });
      console.log('error is ');
      console.log(error)
      util.showFailToast();
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
    console.log('refresh!');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    console.log('onReachBottom!');
    if(this.data.title === '我创建的活动') {
      this.refreshListForMyActivity();
    }
    if(this.data.title === '我参与的活动') {
      this.refreshListForMySignUpActivity();
    }
    
  },

})