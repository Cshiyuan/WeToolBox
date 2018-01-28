// pages/album/createAlbum/createAlbum.js
const { uploadImages } = require('../../../utils/cos')
const { insertAlbumPromise } = require('../../../utils/albumRequestPromise')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    description: '',
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //输入标题
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    });

    // this.judgeCanPublish();
  },

  //输入说明
  inputDescrtiption: function (e) {
    this.setData({
      description: e.detail.value
    });
    // this.judgeCanPublish();
  },

  previewImages: function (e) {
    console.log('previewImages', e)
    let index = e.currentTarget.dataset.index;
    if (index) {
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



  createAlbum: function (e) {

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
        return insertAlbumPromise({
          title: that.data.title,
          description: that.data.description,
          photos: photos
        })

      }).then(result => {

        console.log(result)

      }).catch(err => {

        console.log(err)
      })
    }
  }
})