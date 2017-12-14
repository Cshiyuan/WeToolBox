// pages/activity/publishActivity/publishActivity.js
const util = require('../../../utils/util');
const { insertActivityPromise } = require('../../../utils/requestPromise');


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
    positions: [],
    isCanPublish: false,
    loading: false

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

  //输入标题
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    });

    this.judgeCanPublish();
  },

  //输入说明
  inputDescrtiption: function (e) {
    this.setData({
      description: e.detail.value
    });
    this.judgeCanPublish();
  },

  //跳转到设置地点的页面
  toSetUpPosition: function (e) {
    wx.navigateTo({
      url: '../setupPosition/setupPosition'
    });
  },

  //设置日期
  bindDateChange: function (e) {

    let dateTime = new Date(e.detail.value);
    let time = new Date(this.data.toDay);
    let number = dateTime.getTime() - time.getTime();
    console.log(number);
    if (number > 0) {

      this.setData({
        nowTime: {},
        date: e.detail.value
      });
    } else {

      let myDateString = util.formatTime(new Date());
      let nowTime = myDateString.split(' ')[1].substring(0, 5);
      this.setData({
        nowTime: nowTime,
        date: e.detail.value
      });
    }
  },

  //设置时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //判断是否可以发布
  judgeCanPublish: function () {

    if (this.data.title.trim().length > 0 && this.data.description.trim().length) {

      this.setData({
        isCanPublish: true
      });
    } else {

      this.setData({
        isCanPublish: false
      });
    }
  },

  //创建活动
  createActivity: function () {

    if (!this.data.isCanPublish) {
      return;
    }

    let open_id = '233554';
    let title = this.data.title;
    let description = this.data.description;
    let time = this.data.time;
    let date = this.data.date;
    let position = '';

    if (this.data.positions.length > 0) {
      let tempObject = {
        lat: this.data.positions[0].location.lat,
        lng: this.data.positions[0].location.lng,
        radius: this.data.positions[0].radius
      }
      position = JSON.stringify(tempObject);  //转换成JSON字符串
    }

    this.setData({
      isCanPublish: false,
      loading: true
    });

    let that = this;

    insertActivityPromise({
      open_id: open_id,
      title: title,
      description: description,
      position: position,
      time: time,
      date: date
    }).then(result => {

      if (result.activity.activity_id) {

        let url = '/pages/activity/punchActivity/punchActivity';
        let param = util.generateNaviParam({
          activity_id: result.activity.activity_id
        });

        wx.redirectTo({
          url: url + param
        });

      } else {

        util.showFailToast();
        that.setData({
          isCanPublish: true,
          loading: false
        });
      }

    }).catch(err => {

      console.log('catch err ' + err);
      util.showFailToast();
      that.setData({
        isCanPublish: true,
        loading: false
      });
    });
  }

})