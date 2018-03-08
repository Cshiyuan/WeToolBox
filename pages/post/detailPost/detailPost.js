// pages/post/detailPost/detailPost.js
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const {
  insertCommentPromise,
  getCommentListPromise,
  deleteCommentPromise,
  starPostPromise,
  unStarPostPromise,
  getPostPromise
} = require('../../../utils/postRequestPromise');
const { getOpenGIdByShareTicket } = require('../../../utils/groupRequestPromise');
const { imageView2UrlFormat } = require('../../../utils/cos')
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // star: false
    commentValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.updateShareMenu({
      withShareTicket: true
    });

    let promise;
    if (options.isShare) {
      let context = getApp().globalData.context;
      if (context && context.scene === 1044 && context.shareTicket) {
        console.log('success to share to group');
        promise = getOpenGIdByShareTicket(context.shareTicket).then(result => {

          console.log('decryptDataPromise result is ', result);
          if (result.openGId) {
            //判断是否是同一个群
            if (options.openg_id === result.openGId) {

              return getPostPromise({ post_id: options.post_id }).then(post => {
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
                return post

              });
            } else {

              return Promise.reject('different group!')
            }
          } else {
            return Promise.reject('decryptDataPromise error!')
          }
        });

      } else {
        promise = Promise.reject('scene is error !')
      }
    } else {  //非分享情况
      promise = getGlobalPromise();
    }


    let that = this;
    promise.then(result => {

      that.setData({
        post: result
      });

      return that.refreshCommentList(result.post_id)

    }).catch(error => {

      console.log(error);
      wx.redirectTo({
        url: '/pages/emptyTips/emptyTips'
      });
    });


  },


  /**
   * 刷新评论
   */
  refreshCommentList: function (post_id) {

    let that = this;
    return getCommentListPromise({

      post_id: post_id
    }).then(result => {

      console.log(result);
      result.forEach(item => {
        item.time = timestampFormat(new Date(item.create_time) / 1000)
      })
      that.setData({
        comments: result,
      });

    }).catch(error => {

      console.log(error);
    });

  },



  /**
   * 图片预览
   */
  previewImage: function (e) {

    console.log('previewImages', e)
    let imageIndex = e.currentTarget.dataset.imageindex;
    if (imageIndex !== undefined) {

      let current = this.data.post.originUrls[imageIndex];
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: this.data.post.originUrls // 需要预览的图片http链接列表
      })
    }

  },

  /**
   * 提交评论
   */
  commitComment: function (e) {

    console.log('commitComment', e);
    let inputValue = e.detail.value;
    let that = this;
    if (inputValue.trim().length === 0) {
      return;
    }
    insertCommentPromise({
      content: inputValue,
      post_id: this.data.post.post_id
    }).then(result => {

      let comment = result.comment;
      let comments = that.data.comments;
      comments.unshift(comment);
      that.setData({
        comments: comments,
        'post.comment': that.data.post.comment + 1,
        commentValue: ''
      });

      let pageStacks = getCurrentPages();
      if (pageStacks.length === 1) {
        return;
      }
      let prePage = pageStacks[pageStacks.length - 2];
      // console.log(prePage);
      let postList = prePage.data.postList;
      let index = postList.findIndex((value) => {  //寻找到特定的
        if (value.post_id === that.data.post.post_id)
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
   * 长按删除评论
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
              object_id: that.data.post.post_id
            }).then(result => {

              let comments = that.data.comments;
              comments.splice(index, 1);
              that.setData({
                comments: comments,
                'post.comment': that.data.post.comment - 1
              });

              let pageStacks = getCurrentPages();
              if (pageStacks.length === 1) {
                return;
              }
              let prePage = pageStacks[pageStacks.length - 2];
              let postList = prePage.data.postList;
              let index = postList.findIndex((value) => {  //寻找到特定的
                if (value.post_id === that.data.post.post_id)
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
      that.setData({
        post: post
      });

      let pageStacks = getCurrentPages();
      if (pageStacks.length === 1) {
        return;
      }
      let prePage = pageStacks[pageStacks.length - 2];
      // console.log(prePage);
      let postList = prePage.data.postList;
      let index = postList.findIndex((value) => {  //寻找到特定的
        if (value.post_id === that.data.post.post_id)
          return true;
      });
      postList[index].star = post.star;  //同步点赞数量和状态
      postList[index].isStar = post.isStar;

      prePage.setData({
        postList: postList
      });

    }).catch(error => {

      console.log(error)
    })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {


    let that = this;
    let param = generateNaviParam({  //生成转发参数
      openg_id: this.data.post.object_id,
      post_id: this.data.post.post_id,
      isShare: true
    });

    console.log('share Path is ', '/pages/post/detailPost/detailPost' + param);

    return {
      // title: '快来进入专属群日记吧',
      title: '群日记动态',
      path: '/pages/post/detailPost/detailPost' + param,
      // imageUrl: 'http://wetoolbox-1252042156.picgz.myqcloud.com/20180306/9ad9cf92-9eb8-4ad8-a20f-bc3b9a07a895.JPG',
      success: function (res) {

        console.log('onShareAppMessage success', res);
        let shareTicket = res.shareTickets[0]
        // that.getOpenGIdByShareTicket(shareTicket).then(result => {

        //   console.log('decryptDataPromise result is ', result);
        //   if (result.openGId) {
        //     that.setData({
        //       openGId: result.openGId,
        //       showShareLink: false
        //     });
        //     that.refreshPostList(result.openGId);
        //   }
        // });
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        console.log('onShareAppMessage fail', res);
      }
    }
  },



})