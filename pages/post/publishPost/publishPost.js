// pages/post/publishPost/publishPost.js
const { uploadImages, imageView2UrlFormat } = require('../../../utils/cos')
const { insertPostPromise } = require('../../../utils/postRequestPromise');
const { showFailToast, showLoading } = require('../../../utils/util');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
// const { imageView2UrlFormat } = require('../../../utils/cos')
const util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let object_id = options.object_id;
    if (object_id) {
      this.setData({
        object_id: object_id,
      });
    }

  },

  //输入标题
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    });

    // this.judgeCanPublish();
  },

  //输入说明
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    });
    // this.judgeCanPublish();
  },

  previewImages: function (e) {

    console.log('previewImages', e)
    let index = e.currentTarget.dataset.index;
    if (index !== undefined) {
      let image = this.data.images[index];
      wx.previewImage({
        current: image, // 当前显示图片的http链接
        urls: this.data.images // 需要预览的图片http链接列表
      })
    }
  },

  deletePhoto: function (e) {

    console.log('deletePhoto', e);
    let index = e.currentTarget.dataset.index;
    if (index !== undefined) {
      let images = this.data.images;
      images.splice(index, 1);
      this.setData({
        images: images
      })
    }
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });
      }
    })

  },

  publishPost: function (e) {

    let images = this.data.images;
    let that = this;

    showLoading('');

    let promise;

    //存在图片
    if (images && images.length) {

      promise = uploadImages({
        images: images
      }).then(results => {

        console.log(results)

        let photos = [];
        results.forEach(item => {
          photos.push({
            url: item,
            name: '',
            extra: ''
          });
        })
        return photos;

      });

      //不存在图片，直接发布
    } else if (this.data.content.length > 0) {

      promise = Promise.resolve([]);
    }

    promise.then(photos => {

      return insertPostPromise({   //提交服务器
        object_id: that.data.object_id,
        content: that.data.content,
        photos: photos
      })

    }).then(result => {


      console.log(result);
      let post = result.post;
      if (post) {
        post.thumbnailUrls = [];
        post.originUrls = [];
        post.images.forEach(item => {

          post.thumbnailUrls.push(imageView2UrlFormat(item, {
            width: 200,
            height: 200
          }));
          post.originUrls.push(imageView2UrlFormat(item))

        });

        let pageStacks = getCurrentPages();
        let prePage = pageStacks[pageStacks.length - 2];
        console.log(prePage);

        let postList = prePage.data.postList;  //拼接到数组的开头
        postList.unshift(post);
        prePage.setData({
          postList: postList
        })
        wx.navigateBack({  //返回两次
          delta: 1
        });
      }

      // prePage.setData({
      //   'activity.type': type
      // });
      // setGlobalPromise({
      //   promise: Promise.resolve(result)
      // });
      // let url = '/pages/album/listPhoto/listPhoto';
      // let param = util.generateNaviParam({
      //   album_id: result.album.album_id
      // });

      // wx.redirectTo({
      //   url: url + param
      // });

    }).catch(err => {
      console.log(err)
    })
  }


})
