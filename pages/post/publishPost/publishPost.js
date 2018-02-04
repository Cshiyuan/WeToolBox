// pages/post/publishPost/publishPost.js
const { uploadImages } = require('../../../utils/cos')
const { insertPostPromise } = require('../../../utils/postRequestPromise');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
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

    let activity_id = options.activity_id;
    if (activity_id) {
      this.setData({
        activity_id: activity_id,
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
    if (index) {
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
    if (images && images.length) {
      uploadImages({

        images: images
      }).then(results => {

        console.log(results)
        let photos = []
        results.forEach(item => {
          photos.push({
            url: item,
            name: '',
            extra: ''
          });
        })
        return insertPostPromise({   //提交服务器
          activity_id: that.data.activity_id,
          content: that.data.content,
          photos: photos
        })

      }).then(result => {


        console.log(result)
        setGlobalPromise({
          promise: Promise.resolve(result)
        });
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
  }
})