// pages/activity/setupPosition/setupPosition.js
const bmap = require('../../../libs/bmap-wx');
const { wxPromisify } = require('../../../utils/util');
const getLocationPromise = wxPromisify(wx.getLocation);


Page({
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
      }
    }],
    circles: [{
      latitude: 23.099994,
      longitude: 113.324520,
      color: '#FFFFE0AA',
      fillColor: '#FFFFE0AA',
      radius: 100
    }],
    sugData: [],
    inputVal: "",
    position: {},
    inputShowed: false,

  },

  onLoad: function (e) {

    //新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak: 'hOfa0G8FQM2LgYxmqSVsu7rUyeS043Np'
    });
    this.BMap = BMap;

    let that = this;
    getLocationPromise({
      type: 'gcj02'
    }).then(res => {
      let circle = that.data.circles[0];
      let marker = that.data.markers[0];
      circle.latitude = res.latitude;
      circle.longitude = res.longitude;
      marker.latitude = res.latitude;
      marker.longitude = res.longitude;


      that.BMap.regeocoding({
        location: res.latitude.toString() + ',' + res.longitude.toString(),
        success: function (res) {
          console.log(res);
          marker.callout.content = res.wxMarkerData[0].address;
          that.setData({
            circles: [circle],
            markers: [marker],
          });
        }
      });

    }).catch(err => {
      console.log(err);
    });


    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     let circle = that.data.circles[0];
    //     let marker = that.data.markers[0];
    //     circle.latitude = res.latitude;
    //     circle.longitude = res.longitude;
    //     marker.latitude = res.latitude;
    //     marker.longitude = res.longitude;
    //     that.setData({
    //       circles: [circle],
    //       markers: [marker],
    //     });
    //   }
    // });
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    let that = this;

    let fail = function (data) {
      console.log(data)
    };
    let success = function (data) {
      if (data.result) {
        that.setData({
          sugData: data.result
        });
      } else {
        that.setData({
          sugData: []
        });
      }
    }
    if (e.detail.value && e.detail.value !== '') {
      // 发起suggestion检索请求 
      this.BMap.suggestion({
        query: e.detail.value,
        fail: fail,
        success: success
      });
    }
    this.setData({
      inputVal: e.detail.value
    });
  },

  tapPositionItem: function (e) {

    let index = e.currentTarget.dataset.index;
    let item = this.data.sugData[index];
    let circle = this.data.circles[0];
    let marker = this.data.markers[0];
    circle.latitude = item.location.lat;
    circle.longitude = item.location.lng;
    marker.latitude = item.location.lat;
    marker.longitude = item.location.lng;
    marker.callout.content = item.name;
    if (item) {
      this.setData({
        sugData: [],
        circles: [circle],
        markers: [marker],
        position: item,
        inputVal: "",
        inputShowed: false
      });
    } else {
      this.setData({
        sugData: [],
        inputVal: "",
        inputShowed: false
      });
    }
    console.log(e);
  },

  commit: function (e) {

  },

  cancel: function (e) {
    // wx.chooseLocation({
    //   success: function (res) {
    //     console.log(res);

    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });
  }

})