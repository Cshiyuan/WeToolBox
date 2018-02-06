// pages/post/detailPost/detailPost.js
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const { insertCommentPromise, getCommentListPromise } = require('../../../utils/postRequestPromise');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    let promise = getGlobalPromise();
    promise.then(result => {

      console.log(result);

      that.setData({
        post: result
      });

      return getCommentListPromise({
        post_id: result.post_id
      });


    }).then(result => {

      console.log(result);
      that.setData({
        comments: result
      });

    }).catch(error => {

      console.log(error);
    });
  },

  commitComment: function (e) {
    console.log('commitComment', e);
    let inputValue = e.detail.value;
    insertCommentPromise({
      content: inputValue,
      post_id: this.data.post.post_id
    }).then(result => {

      console.log(result);
    }).catch(err => {
      console.log(err)
    })


  }
})