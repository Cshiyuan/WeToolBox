// pages/post/detailPost/detailPost.js
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const {
  insertCommentPromise,
  getCommentListPromise,
  deleteCommentPromise,
  starPostPromise,
  unStarPostPromise
} = require('../../../utils/postRequestPromise');
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

    let that = this;
    let promise = getGlobalPromise();
    promise.then(result => {

      // console.log(result);

      that.setData({
        post: result
      });

      return getCommentListPromise({
        post_id: result.post_id
      });


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

  commitComment: function (e) {

    console.log('commitComment', e);
    let inputValue = e.detail.value;
    let that = this;
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



  }
})