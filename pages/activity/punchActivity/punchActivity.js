// pages/activity/punchActivity/punchActivity.js
const wxTimer = require('../../../utils/wxTimer');
const { getActivityPromise, signUpActivityPromise, punchActivityPromise } = require('../../../utils/requestPromise');
const { countDown, formatTime } = require('../../../utils/util');


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
    wxTimerList: {},
    isAlreadyStart: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    let that = this;
    if (options.activity_id) {
      this.refreshActivityById(options.activity_id);
    }
  },

  onShow: function (options) {
    if (this.timer) {
      this.timer.calibration();
    }
  },




  /**
   * 跳转到设置界面
   */
  naviToSetting: function (e) {
    wx.navigateTo({
      url: '../settingActivity/settingActivity'
    });
  },

  /**
   * 根据activity_id刷新
   */
  refreshActivityById: function (activityId) {

    let that = this;
    getActivityPromise({
      activity_id: activityId
    }).then(result => {

      console.log(result);

      let time = result.activity.date + ' ' + result.activity.time;
      let date = new Date(time);

      let startTimeStr = date.getFullYear().toString() + '年' + (date.getMonth() + 1).toString() + '月'
        + date.getDate().toString() + '日' + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString();

      console.log(startTimeStr);

      that.setData({
        activity: result.activity,
        startTimeStr: startTimeStr
      });

      //开始计时器
      if (date) {

        let timer = new wxTimer({
          endTime: date,
          complete: function () {
            console.log("倒计时结束了")
            that.setData({
              isAlreadyStart: true
            });
          }
        });
        that.timer = timer;
        timer.start(that);
      }

    }).catch(err => {

      console.log('catch err is ' + err);
    })

  },

  /**
   * 报名活动
   */
  signUpActivity: function (e) {

    signUpActivityPromise({

      activity_id: activity.activity_id
    }).then((result) => {

      console.log(result);
    });
  },

  /**
   * 打开活动
   */
  punchActivity: function (e) {

    punchActivityPromise({

      activity_id: activity.activity_id
    }).then((result) => {

      console.log(result);
    });

  }


})