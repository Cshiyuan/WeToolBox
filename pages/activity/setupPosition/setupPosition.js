// pages/activity/setupPosition/setupPosition.js
const bmap = require('../../../libs/bmap-wx');
const { wxPromisify, showTips } = require('../../../utils/util');
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

    this.map = wx.createMapContext('map');

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
          let wxMarkerData = res.wxMarkerData[0];
          marker.callout.content = wxMarkerData.address;
          marker.label.content = '(' + wxMarkerData.latitude + ',' + wxMarkerData.longitude + ')';
          that.setData({
            circles: [circle],
            markers: [marker],
            position: that.translateToPoition(res)
          });
          that.judgeMapScale();
        }
      });

    }).catch(err => {
      console.log(err);
    });



  },

  //调整范围
  sliderChange: function (e) {
    let value = e.detail.value;
    let circle = this.data.circles[0];
    circle.radius = value;
    this.setData({
      circles: [circle],
    })
    console.log(e);

  },

  //开始输入搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  //停止输入搜索框
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  //清空搜索框输入
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  //搜索框输入监听
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

  //点击地址
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
    marker.label.content = '(' + item.location.lat.toFixed(3) + ',' + item.location.lng.toFixed(3) + ')';
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
    // console.log(e);
    this.judgeMapScale();
  },

  translateToPoition: function (res) {
    // lat lng
    console.log('translateToPoition');
    console.log(res);
    return {
      name: res.originalData.result.formatted_address,
      location: res.originalData.result.location,
      uid: 'none',
      city: res.originalData.result.addressComponent.city,
      district: res.originalData.result.addressComponent.district,
      business: res.originalData.result.business,
      cityid: res.originalData.result.cityCode
    };
  },

  //确认位置button
  commit: function (e) {
    //获得页面栈
    let pageStacks = getCurrentPages();
    let prePage = pageStacks[pageStacks.length - 2];
    let position = this.data.position;
    position.radius = this.data.circles[0].radius;   //添加半径
    position.address = this.data.markers[0].callout.content;
    prePage.setData({
      positions: [position]
    });
    //返回
    wx.navigateBack({
      delta: 1
    });
  },

  //不设置位置button
  cancel: function (e) {

    let pageStacks = getCurrentPages();
    let prePage = pageStacks[pageStacks.length - 2];
    prePage.setData({
      position: []
    });
    //返回
    wx.navigateBack({
      delta: 1
    });
  },


  /**
   * 根据定位和
   */
  judgeMapScale: function () {

    let that = this;
    let position = this.data.position.location;

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
            latitude: position.lat,
            longitude: position.lng,
          }]
        })

      }).catch(err => {
        console.log(err);
        showTips('提示', '请确认一下网络和定位服务是否开启了哦。')
      });
    }

  },

})