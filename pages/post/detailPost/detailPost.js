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
    star: false
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
      result.comments.forEach(item => {
        item.time = timestampFormat(new Date(item.create_time) / 1000)
      })
      that.setData({
        comments: result.comments,
        starState: result.starState
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

              console.log(result);
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
    // let post_id = this.data.post.post_id;

    if (this.data.star) {
      this.setData({
        star: false
      });
    } else {
      // that.setData({
      //   star: true
      // });

      starPostPromise({
        post_id: post_id,
      }).then(result => {

        console.log(result);
        that.setData({
          star: true
        });
      }).catch(error => {

        console.log(error)
      })
    }

  }
})