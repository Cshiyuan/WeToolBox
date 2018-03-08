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
  insertCommentPromise,
  getCommentListPromise,
  deleteCommentPromise,
  starPostPromise,
  unStarPostPromise
} = require('../../../utils/postRequestPromise');

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


    wx.updateShareMenu({
      withShareTicket: true
    });

    let that = this;
    let promise = getGlobalPromise();
    promise.then(result => {
      that.setData({
        post: result
      });
    });

    if (options.activity_id && options.post_id) {
      this.setData(options)
      this.refreshActivityById(options.activity_id);
      this.refreshCommentListPromise(options.post_id);
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
   * 根据post_id刷新评论
   */
  refreshCommentListPromise: function (post_id) {

    let that = this;
    getCommentListPromise({
      post_id: post_id
    }).then(result => {

      console.log(result);
      result.forEach(item => {
        item.time = timestampFormat(new Date(item.create_time) / 1000)
      })
      that.setData({
        comments: result,
      });

      wx.stopPullDownRefresh();
    }).catch(error => {

      wx.stopPullDownRefresh();
      console.log(error);
    });

  },


  /**
   * 根据activity_id打卡Activity
   */
  punchActivityById: function (activityId) {

    let that = this;
    if (!this.data.commitLoading) {
      this.setData({
        commitLoading: true
      })
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
    console.log(error);


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
  * 发表评论事件响应
  */
  commitComment: function (e) {

    console.log('commitComment', e);
    let inputValue = e.detail.value;
    let that = this;
    insertCommentPromise({
      content: inputValue,
      post_id: this.data.post_id
    }).then(result => {

      let comment = result.comment;
      let comments = that.data.comments;
      comments.unshift(comment);
      that.setData({
        comments: comments,
        // 'post.comment': that.data.post.comment + 1,
        commentValue: ''
      });

      let pageStacks = getCurrentPages();
      let prePage = pageStacks[pageStacks.length - 2];
      // console.log(prePage);
      let postList = prePage.data.postList;
      let index = postList.findIndex((value) => {  //寻找到特定的
        if (value.post_id === that.data.post_id)
          return true;
      });
      postList[index].comment = postList[index].comment + 1;
      prePage.setData({
        postList: postList
      });

      console.log(result);
    }).catch(err => {
      console.log(err)
    })


  },

  /**
   * 长按评论事件响应
   */
  longpressComment: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    if (index !== undefined) {
      let that = this;
      wx.showActionSheet({
        itemList: ['删除'],
        itemColor: '#DC143C',
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex === 0) {  //删除
            deleteCommentPromise({
              comment_id: that.data.comments[index].comment_id,
              object_id: that.data.post_id
            }).then(result => {

              let comments = that.data.comments;
              comments.splice(index, 1);
              that.setData({
                comments: comments,
              });

              let pageStacks = getCurrentPages();
              let prePage = pageStacks[pageStacks.length - 2];
              let postList = prePage.data.postList;
              let index = postList.findIndex((value) => {  //寻找到特定的
                if (value.post_id === that.data.post_id)
                  return true;
              });
              postList[index].comment = postList[index].comment - 1;
              prePage.setData({
                postList: postList
              });

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
  * 点赞
  */
  tapStar: function (e) {

    let that = this;

    // let postList = this.data.postList;
    let post = this.data.post;
    let isStar = this.data.post.isStar;
    let post_id = this.data.post.post_id;
    let param = {
      post_id: post_id,
    }
    let promise = isStar ? unStarPostPromise(param) : starPostPromise(param);

    promise.then(result => {

      post.isStar = !isStar
      post.star = isStar ? post.star - 1 : post.star + 1;

      let pageStacks = getCurrentPages();
      let prePage = pageStacks[pageStacks.length - 2];
      // console.log(prePage);
      let postList = prePage.data.postList;
      let index = postList.findIndex((value) => {  //寻找到特定的
        if (value.post_id === that.data.post.post_id)
          return true;
      });
      postList[index].star = post.star;  //同步点赞数量和状态
      postList[index].isStar = post.isStar;
      that.setData({
        post: post
      });
      prePage.setData({
        postList: postList
      });

    }).catch(error => {

      console.log(error)
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshActivityById(this.data.activity_id);
    this.refreshCommentListPromise(this.data.post_id);
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