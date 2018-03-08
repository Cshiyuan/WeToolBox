// pages/group/indexGroup.js
const { wxPromisify } = require('../../../utils/util');
const { decryptDataPromise } = require('../../../utils/groupRequestPromise');
const {
  getPostListAlbumListPromise,
  deletePostPromise,
  starPostPromise,
  unStarPostPromise } = require('../../../utils/postRequestPromise');
const { imageView2UrlFormat } = require('../../../utils/cos')
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const getShareInfoPromise = wxPromisify(wx.getShareInfo);


Page({

  /**
   * 页面的初始数据
   */
  data: {
    openGId: '',
    postList: [],
    loading: false,
    end: 0,   //请求参数
    length: 5,
    showShareLink: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.updateShareMenu({
      withShareTicket: true
    });

    console.log('indexGroup onLoad', options)
    let context = getApp().globalData.context;
    let that = this;
    console.log('context is ', context);
    if (context && context.scene === 1044) {
      //符合条件的
      // console.log('context is ', context);
      let shareTicket = context.shareTicket;
      that.getOpenGIdByShareTicket(shareTicket).then(result => {

        console.log('decryptDataPromise result is ', result);
        if (result.openGId) {
          that.setData({
            openGId: result.openGId
          });
          that.refreshPostList(result.openGId);
        }
      });

    } else if (options.openGId) {

      that.refreshPostList(options.openGId);
      that.setData({
        openGId: options.openGId
      });
    } else {
      this.setData({
        showShareLink: true
      })
    }

    // console.log(options);

  },

  /**
   * 刷新动态列表
   */
  getOpenGIdByShareTicket: function (shareTicket) {

    // let openGId = openGId;  //帖子id
    return getShareInfoPromise({

      shareTicket: shareTicket
    }).then(result => {

      console.log('getShareInfoPromise result is ', result);
      return decryptDataPromise({
        encryptedData: result.encryptedData,
        iv: result.iv
      })
    })

  },

  /**
   * 刷新动态列表
   */
  refreshPostList: function (openGId) {

    // let openGId = openGId;  //帖子id
    let that = this;
    this.setData({
      loading: true
    });
    getPostListAlbumListPromise({
      start: this.data.end,  //分页查询
      length: this.data.length,
      object_id: openGId
    }).then(result => {
      console.log(result);

      result.postList.forEach(post => {

        if (post.type === 1) {
          post.activity = JSON.parse(post.extra);
          if (post.activity.position) {
            post.activity.position = JSON.parse(post.activity.position);
          }
        }

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
   * 跳转到帖子发布器
   */
  naviToPublishPost: function (e) {

    let url = '/pages/post/publishPost/publishPost';
    let param = generateNaviParam({
      object_id: this.data.openGId,
    });

    wx.navigateTo({
      url: url + param
    });
  },


  /**
   * 跳转到活动发布器
   */
  naviToPublishActivity: function (e) {

    let param = generateNaviParam({
      object_id: this.data.openGId,
    });
    wx.navigateTo({
      url: '/pages/activity/publishActivity/publishActivity' + param
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
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {

    console.log('onReachBottom!');
    if (this.data.openGId) {
      this.refreshPostList(this.data.openGId);
    }
  },

  /**
   * 跳转到帖子详情页
   */
  naviToDetailPost: function (e) {

    console.log('naviToDetailPost ', e);
    let postIndex = e.currentTarget.dataset.postindex;
    let post = this.data.postList[postIndex];
    if (post.type === 0) {

      console.log(post)
      setGlobalPromise({
        promise: Promise.resolve(post)
      })

      wx.navigateTo({
        url: '/pages/post/detailPost/detailPost'
      });
    }
    if (post.type === 1) {

      console.log(post)
      // console.log(post)
      setGlobalPromise({
        promise: Promise.resolve(post)
      })
      // setGlobalPromise({
      //   promise: Promise.resolve(post)
      // })

      let url = '/pages/activity/punchActivity/punchActivity';
      let param = generateNaviParam({
        activity_id: post.activity.activity_id,
        post_id: post.post_id
      });

      wx.navigateTo({
        url: url + param
      });
    }

  },


  /**
   * 跳转到相册界面 
   */
  naviToAlbumList: function (e) {

    let url = '/pages/album/listAlbum/listAlbum';
    let param = generateNaviParam({
      activity_id: this.data.openGId,
    });

    wx.navigateTo({
      url: url + param
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

    let that = this;
    return {
      title: '快来进入专属群日记吧',
      path: '/pages/group/indexGroup/indexGroup',
      imageUrl: 'http://wetoolbox-1252042156.picgz.myqcloud.com/20180306/9ad9cf92-9eb8-4ad8-a20f-bc3b9a07a895.JPG',
      success: function (res) {

        console.log('onShareAppMessage success', res);
        let shareTicket = res.shareTickets[0]
        that.getOpenGIdByShareTicket(shareTicket).then(result => {

          console.log('decryptDataPromise result is ', result);
          if (result.openGId) {
            that.setData({
              openGId: result.openGId,
              showShareLink: false
            });
            that.refreshPostList(result.openGId);
          }
        });
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        console.log('onShareAppMessage fail', res);
      }
    }
  },
})