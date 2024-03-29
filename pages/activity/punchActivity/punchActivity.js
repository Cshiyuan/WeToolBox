// pages/activity/punchActivity/punchActivity.js
const Promise = require('../../../libs/bluebird');
const wxTimer = require('../../../utils/wxTimer');
const bmap = require('../../../libs/bmap-wx');
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
const { imageView2UrlFormat } = require('../../../utils/cos')
const { getActivityPromise, signUpActivityPromise, punchActivityPromise } = require('../../../utils/activityRequestPromise');
const { countDown, formatTime, getDistance, wxPromisify, formatNumber, showTips } = require('../../../utils/util');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const getLocationPromise = wxPromisify(wx.getLocation);
const {
  getPostListAlbumListPromise,
  deletePostPromise,
  starPostPromise,
  unStarPostPromise } = require('../../../utils/postRequestPromise');

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
    commitLoading: false,
    myLocation: {},

    postList: [],
    loading: false,
    end: 0,   //请求参数
    length: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    let that = this;

    if (options.fromCreate) {
      let promise = getGlobalPromise();
      promise.then(result => {

        console.log(result);
        if (!result.activity) {
          wx.redirectTo({
            url: '/pages/emptyTips/emptyTips'
          });
        }
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


        let countDown = date.getTime() - Date.now();
        if (countDown <= 0) {//距离结束时间小于0，说明已经开始，返回空串
          // that.toptips.showTopTips('活动已经开始了哦。');
          that.setData({
            isAlreadyStart: true
          });
        } else if (date) {  //开始计时器 
          // that.toptips.showTopTips('活动还没开始，你不能打卡哦。');

          let timer = new wxTimer({
            endTime: date,
            complete: function () {
              console.log("倒计时结束了");

              that.setData({
                isAlreadyStart: true
              });
            }
          });
          that.timer = timer;
          timer.start(that);
        }
        wx.stopPullDownRefresh();
        return that.judgeMapScale(); //调整地图scale


      }).catch(err => {
        wx.stopPullDownRefresh();
        console.log('catch err is ' + err);
      });
      
    } else {

      if (options.activity_id) {

        this.setData(options)
        this.refreshActivityById(options.activity_id);
        this.refreshPostList(options.activity_id);
      }
    }

    //新建百度地图对象
    let BMap = new bmap.BMapWX({
      ak: 'hOfa0G8FQM2LgYxmqSVsu7rUyeS043Np'
    });
    this.BMap = BMap;
    this.map = wx.createMapContext('map');
  },

  onReady: function () {
    // this.refreshPostList();
    // this.toptips = this.selectComponent("#toptips");
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
      if (!result.activity) {
        wx.redirectTo({
          url: '/pages/emptyTips/emptyTips'
        });
      }
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


      let countDown = date.getTime() - Date.now();
      if (countDown <= 0) {//距离结束时间小于0，说明已经开始，返回空串
        // that.toptips.showTopTips('活动已经开始了哦。');
        that.setData({
          isAlreadyStart: true
        });
      } else if (date) {  //开始计时器 
        // that.toptips.showTopTips('活动还没开始，你不能打卡哦。');

        let timer = new wxTimer({
          endTime: date,
          complete: function () {
            console.log("倒计时结束了");

            that.setData({
              isAlreadyStart: true
            });
          }
        });
        that.timer = timer;
        timer.start(that);
      }
      wx.stopPullDownRefresh();
      return that.judgeMapScale(); //调整地图scale


    }).catch(err => {
      wx.stopPullDownRefresh();
      console.log('catch err is ' + err);
    })

  },

  /**
   * 刷新动态列表
   */
  refreshPostList: function (activityId) {

    let activity_id = activityId;  //帖子id
    let that = this;
    this.setData({
      loading: true
    });
    getPostListAlbumListPromise({
      start: this.data.end,  //分页查询
      length: this.data.length,
      activity_id: activity_id
    }).then(result => {
      console.log(result);

      result.postList.forEach(post => {
        post.time = timestampFormat(Date.parse(post.create_time) / 1000)
        post.thumbnailUrls = [];
        post.originUrls = [];
        post.images.forEach(item => {

          post.thumbnailUrls.push(imageView2UrlFormat(item, {
            width: 200,
            height: 200
          }));
          post.originUrls.push(imageView2UrlFormat(item))

        })
      });
      result.albumList.forEach(album => {
        album.cover = imageView2UrlFormat(album.cover, {
          width: 100,
          height: 100
        });
      });
      // result.albumList = result.albumList.concat(result.albumList);  注释掉测试代码
      // that.data.activityList.concat(array),
      that.setData({
        postList: that.data.postList.concat(result.postList),
        albumList: result.albumList,
        end: that.data.end + that.data.length,
        loading: false
      });

    }).catch(err => {
      console.log(err);
    });

  },

  /**
   * 图片预览
   */
  previewImage: function (e) {

    console.log('previewImages', e)
    let postIndex = e.currentTarget.dataset.postindex;
    let imageIndex = e.currentTarget.dataset.imageindex;
    if (postIndex !== undefined && imageIndex !== undefined) {
      let post = this.data.postList[postIndex];
      // let image = this.data.images[index];
      let current = post.originUrls[imageIndex];
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: post.originUrls // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 打卡Activity
   */
  punchActivityById: function (activityId) {

    let that = this;
    if (!this.data.commitLoading) {
      this.setData({
        commitLoading: true
      });
      return punchActivityPromise({

        activity_id: activityId
      }).then((result) => {

        if (result.ret === -1) {
          that.setData({
            commitLoading: false
          });
          showTips('提示', '创建者关闭打卡入口啦。');

        } else {

          that.setData({
            'activity.punchList': result.data,
            'activity.isPunch': true,
            commitLoading: false
          });
        }

      }).catch(error => {
        that.setData({
          commitLoading: false
        });
        showTips('提示', '网络出错')
        console.log('catch err is ' + err);
      });
    }

  },

  /**
   * 点赞帖子
   */
  tapStar: function (e) {

    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.postindex;
    if (index !== undefined) {

      let postList = this.data.postList;
      let isStar = this.data.postList[index].isStar;
      let post_id = this.data.postList[index].post_id;
      let param = {
        post_id: post_id,
      }
      let promise = isStar ? unStarPostPromise(param) : starPostPromise(param);

      promise.then(result => {

        postList[index].isStar = !isStar
        postList[index].star = isStar ? postList[index].star - 1 : postList[index].star + 1;
        that.setData({
          postList: postList
        });
        console.log(result);

      }).catch(error => {

        console.log(error)
      })
    }

  },

  /**
   * 跳转到设置界面
   */
  naviToSetting: function (e) {


    let url = '/pages/activity/settingActivity/settingActivity';
    let param = generateNaviParam({
      activity_id: this.data.activity.activity_id,
      type: this.data.activity.type
    });

    wx.navigateTo({
      url: url + param
    });
  },

  /**
   * 长按帖子事件响应
   */
  longpressPost: function (e) {
    console.log('longpressPost', e);
    let index = e.currentTarget.dataset.postindex;
    if (index !== undefined) {
      let that = this;
      wx.showActionSheet({
        itemList: ['删除'],
        itemColor: '#DC143C',
        success: function (res) {

          if (res.tapIndex === 0) {  //删除
            deletePostPromise({
              post_id: that.data.postList[index].post_id
            }).then(result => {

              console.log(result);
              let postList = that.data.postList;
              postList.splice(index, 1);
              that.setData({
                postList: postList
              })

            }).catch(err => {

              console.log(err)
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }

  },


  /**
   * 跳转到人员界面
   */
  naviToMemberList: function (e) {

    // console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if (type === "punchList") {
      setGlobalPromise({
        promise: Promise.resolve(this.data.activity.punchList)
      })

    }
    if (type === 'signUpList') {
      setGlobalPromise({
        promise: Promise.resolve(this.data.activity.signUpList)
      })
    }


    wx.navigateTo({
      url: '../../memberList/memberList'
    });
  },

  /**
   * 跳转到帖子发布器
   */
  naviToPublishPost: function (e) {

    let url = '/pages/post/publishPost/publishPost';
    let param = generateNaviParam({
      activity_id: this.data.activity.activity_id,
    });

    wx.navigateTo({
      url: url + param
    });
  },

  /**
   * 跳转到帖子详情页
   */
  naviToDetailPost: function (e) {

    console.log('naviToDetailPost ', e);
    let postIndex = e.currentTarget.dataset.postindex;
    let post = this.data.postList[postIndex];
    console.log(post)
    setGlobalPromise({
      promise: Promise.resolve(post)
    })

    wx.navigateTo({
      url: '/pages/post/detailPost/detailPost'
    });
  },

  /**
   * 跳转到相册界面 
   */
  naviToAlbumList: function (e) {

    let url = '/pages/album/listAlbum/listAlbum';
    let param = generateNaviParam({
      activity_id: this.data.activity.activity_id,
    });

    wx.navigateTo({
      url: url + param
    });
  },

  /**
   * 报名活动
   */
  signUpActivity: function (e) {

    let that = this;
    if (!this.data.commitLoading) {
      this.setData({
        commitLoading: true
      });
      signUpActivityPromise({

        activity_id: this.data.activity.activity_id
      }).then((result) => {

        that.setData({
          'activity.signUpList': result,
          'activity.isSignUp': true,
          commitLoading: false
        });
      }).catch(error => {
        that.setData({
          commitLoading: false
        })
        console.log('catch err is ' + err);
      });
    }
  },

  /**
   * 打卡活动
   */
  punchActivity: function (e) {

    let that = this;
    // console.log(e);
    if (!this.data.commitLoading) {
      getLocationPromise({
        type: 'gcj02'
      }).then(res => {

        //计算出当前距离
        // console.log()
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
        if (distance < that.data.position.radius || !that.data.position.radius) {   //处在允许打卡的范围内,或者并没有设定地点
          return that.punchActivityById(that.data.activity.activity_id);
        } else {
          showTips('提示', '没进入可以打卡的范围哦。')
        }


      }).catch(err => {
        console.log(err);
        showTips('提示', '请确认一下网络和定位服务是否开启了哦。')
      });
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshActivityById(this.data.activity.activity_id);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    console.log('onReachBottom!');
    if (this.data.activity_id) {
      this.refreshPostList(this.data.activity_id);
    }

    // if (this.data.title === '我创建的活动') {
    //   this.refreshListForMyActivity();
    // }
    // if (this.data.title === '我参与的活动') {
    //   this.refreshListForMySignUpActivity();
    // }

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