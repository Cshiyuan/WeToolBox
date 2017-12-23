// pages/activity/punchActivity/punchActivity.js
const Promise = require('../../../libs/bluebird');
const wxTimer = require('../../../utils/wxTimer');
const bmap = require('../../../libs/bmap-wx');
const util = require('../../../utils/util');
const { getActivityPromise, signUpActivityPromise, punchActivityPromise } = require('../../../utils/requestPromise');
const { countDown, formatTime, getDistance, wxPromisify, formatNumber, showTips } = require('../../../utils/util');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const getLocationPromise = wxPromisify(wx.getLocation);

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
    isAlreadyStart: false,
    isOwner: false,
    myLocation: {}
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

    //新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak: 'hOfa0G8FQM2LgYxmqSVsu7rUyeS043Np'
    });
    this.BMap = BMap;

    this.map = wx.createMapContext('map');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if (this.timer) {
      this.timer.calibration();
    }
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
      let time = result.activity.date + ' ' + result.activity.time + ':00';
      let position = result.activity.position === '' ? {} : JSON.parse(result.activity.position);
      console.log(time.replace(/-/g, "/"))
      let date = new Date(time.replace(/-/g, "/"));

      console.log('start time is ' + date);

      let startTimeStr = formatNumber(date.getFullYear()) + '年' + formatNumber((date.getMonth() + 1)) + '月'
        + formatNumber(date.getDate()) + '日' + ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes())

      if (position.lat && position.lng) {

        let circle = that.data.circles[0];
        let marker = that.data.markers[0];
        circle.latitude = position.lat;
        circle.longitude = position.lng;
        circle.radius = position.radius;
        marker.latitude = position.lat;
        marker.longitude = position.lng;
        marker.callout.content = position.address;
        marker.label.content = '(' + position.lat.toFixed(3) + ',' + position.lng.toFixed(3) + ')';
        that.setData({
          circles: [circle],
          markers: [marker],
        });
      }

      that.setData({
        activity: result.activity,
        startTimeStr: startTimeStr,
        position: position,
        isOwner: result.isOwner,
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

      return that.judgeMapScale(); //调整地图scale

    }).catch(err => {

      console.log('catch err is ' + err);
    })

  },

  /**
   * 打卡Activity
   */
  punchActivityById: function (activityId) {

    let that = this;
    return punchActivityPromise({

      activity_id: activityId
    }).then((result) => {

      if (result.ret === -1) {

        showTips('提示', '创建者关闭打卡入口啦。')
      } else {

        that.setData({
          'activity.punchList': result.data,
          'activity.isPunch': true
        });
      }

    }).catch(error => {
      showTips('提示', '网络出错')
      console.log('catch err is ' + err);
    });
  },


  /**
   * 跳转到设置界面
   */
  naviToSetting: function (e) {


    let url = '/pages/activity/settingActivity/settingActivity';
    let param = util.generateNaviParam({
      activity_id: this.data.activity.activity_id,
      type: this.data.activity.type
    });

    wx.navigateTo({
      url: url + param
    });
  },

  /**
   * 跳转到人员界面
   */
  naviToMemberList: function (e) {

    setGlobalPromise({
      promise: Promise.resolve(this.data.activity.signUpList)
    })
    wx.navigateTo({
      url: '../../memberList/memberList'
    });
  },

  /**
   * 报名活动
   */
  signUpActivity: function (e) {

    let that = this;
    signUpActivityPromise({

      activity_id: this.data.activity.activity_id
    }).then((result) => {

      that.setData({
        'activity.signUpList': result,
        'activity.isSignUp': true
      });
    }).catch(error => {

      console.log('catch err is ' + err);
    });
  },

  /**
   * 打卡活动
   */
  punchActivity: function (e) {

    let that = this;
    getLocationPromise({
      type: 'gcj02'
    }).then(res => {

      //计算出当前距离
      let distance = getDistance(res.latitude, res.longitude, that.data.position.lat, that.data.position.lng);

      that.map.includePoints({
        padding: [40, 40, 40, 40],
        points: [{
          latitude: res.latitude,
          longitude: res.longitude,
        }, {
          latitude: that.data.position.lat,
          longitude: that.data.position.lng,
        }]
      })

      console.log('distance is ' + distance);
      console.log('您距离活动目的地的距离是 ' + distance.toString() + ' 米 ')
      if (distance < that.data.position.radius) {   //处在允许打卡的范围内
        return that.punchActivityById(that.data.activity.activity_id);
      } else {
        showTips('提示', '没进入可以打卡的范围哦。')
      }


    }).catch(err => {
      console.log(err);
      showTips('提示', '请确认一下网络和定位服务是否开启了哦。')
    });

  },

  /**
   * 根据定位和
   */
  judgeMapScale: function () {

    let that = this;
    let position = this.data.position;

    if (position.lat && position.lng) {

      return getLocationPromise({
        type: 'gcj02'
      }).then(res => {

        that.map.includePoints({
          padding: [40, 40, 40, 40],
          points: [{
            latitude: res.latitude,
            longitude: res.longitude,
          }, {
            latitude: that.data.position.lat,
            longitude: that.data.position.lng,
          }]
        })

      }).catch(err => {
        console.log(err);
        showTips('提示', '请确认一下网络和定位服务是否开启了哦。')
      });
    }

  },

  /**
   * 分享逻辑
   */
  onShareAppMessage: function (res) {

    let nickName = getApp().globalData.userInfo.nickName;
    let title = this.data.activity.title;
    let activity_id = this.data.activity.activity_id;

    return {
      title: nickName + '发来了一个活动 ' + title,
      path: '/pages/activity/punchActivity/punchActivity?activity_id=' + activity_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }


})