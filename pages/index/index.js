//index.js
//获取应用实例
// const Cos = require('../../libs/cos-wx-sdk-v4')
const { uploadFile } = require('../../utils/cos')
const app = getApp()

var successCallback = function (result) {
  console.log('success', result);
}
var errorCallback = function (result) {
  console.log('success', result);
}
var progressCallback = function (info) {
  console.log('success', result);
}


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {



    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onReady: function () {

    this.toptips = this.selectComponent("#toptips");
    this.noticeBar = this.selectComponent("#noticeBar");
    this.noticeBar.setContent('只是单纯凭借兴趣制作的工具，任何问题可以加交流群反馈。点下面的连接就有群二维码啦。');
  },

  lookGroup: function () {

    let url = 'http://share-server.oss-cn-shenzhen.aliyuncs.com/4BE7BDE6792F92F96916AF0FF97F5BF8.jpg';
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
  },

  naviTo: function (e) {

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (res.tempFilePaths && res.tempFilePaths.length) {
          var tempFilePath = res.tempFilePaths[0];
          wx.showToast({ title: '正在上传...', icon: 'loading', duration: 60000 });
          uploadFile({
            success: successCallback,
            error: errorCallback,
            // onProgress: progressCallback, // 返回 info 对象，带有 loaded、total、percent、speed 四个字段
            filePath: tempFilePath,
            // bucket: 'wetoolbox',
            // insertOnly: 0, // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
            // bizAttr: 'test-biz-val'
          });
        }
      }
    });

    return

    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if (type === 'toCreateActivity') {
      wx.navigateTo({
        url: '/pages/activity/publishActivity/publishActivity'
      });
    }
    if (type === 'myCreateActivity') {
      wx.navigateTo({
        url: '/pages/activity/listActivity/listActivity?myCreateActivityList=true'
      });
    }
    if (type === 'mySignUpActivity') {
      wx.navigateTo({
        url: '/pages/activity/listActivity/listActivity'
      });
    }
  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
