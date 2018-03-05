// pages/album/listPhoto.js
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const { PICGZ_URL } = require('../../../utils/config');
const { imageView2UrlFormat } = require('../../../utils/cos')
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
const { chooseAndUploadImage } = require('../../../utils/cos')
const { insertPhotoPromise, deletePhotoPromise, getAlbumPromise } = require('../../../utils/albumRequestPromise')
// const { getAlbumPromise } = require()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteStatus: false,
    originPhotos: [],
    deletePhotoIds: [],   //待删除对photo_id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    let promise = getGlobalPromise();
    promise.then(result => {
      console.log(result)
      let album = result;
      that.setData({
        album: album
      });
      wx.setNavigationBarTitle({
        title: album.title
      });
      return getAlbumPromise({

        album_id: album.album_id
      });

    }).then(result => {

      console.log(result);
      result.forEach(item => {
        item.originUrl = imageView2UrlFormat(item.url);
        item.thumbnailUrl = imageView2UrlFormat(item.url, {
          width: 300,
          height: 300
        });
      })
      that.setData({
        photos: result
      });
    }).catch(error => {

      console.log(error)
    })
  },

  uploadImages: function (e) {

    let that = this;
    let album_id = this.data.album.album_id;
    if (!album_id) {
      return
    }
    chooseAndUploadImage().then(results => {
      // console.log(results);
      let photos = []
      results.forEach(item => {
        photos.push({
          url: item,
          name: '',
          extra: ''
        });
      })
      return insertPhotoPromise({   //提交服务器
        photos: photos,
        album_id: album_id
      })
    }).then(result => {
      console.log(result)
      result.forEach(item => {
        item.originUrl = imageView2UrlFormat(item.url);
        item.thumbnailUrl = imageView2UrlFormat(item.url, {
          width: 200,
          height: 200
        });
      })
      that.setData({
        photos: result
      });

      let pageStacks = getCurrentPages();
      let prePage = pageStacks[pageStacks.length - 2];
      let albumList = prePage.data.albumList;
      let index = albumList.findIndex((value) => {  //寻找到特定的
        if (value.album_id === that.data.album.album_id)
          return true;
      });
      if (result.length > 0) {
        albumList[index].cover = imageView2UrlFormat(result[0].url, {
          width: 400,
          height: 400
        })
      }
      prePage.setData({
        albumList: albumList
      });

    }).catch(err => {
      console.log(err)
    })
  },

  previewImages: function (e) {
    // console.log('previewImages', e)
    console.log(e)
    let index = e.currentTarget.dataset.index;

    if (index !== undefined) {
      let photoUrl = this.data.photos.map(item => {  //链接列表
        return item.originUrl;
      });
      let image = photoUrl[index];
      wx.previewImage({
        current: image, // 当前显示图片的http链接
        urls: photoUrl // 需要预览的图片http链接列表
      })
    }
  },

  changeToDeleteStatus: function (e) {

    console.log(e)
    let type = e.currentTarget.dataset.type;
    let originPhotos;
    let showPhotos;

    if (type === 'true') {

      type = true
      showPhotos = [];
      originPhotos = this.data.photos;
      this.data.photos.forEach(item => {
        if (item.isOwner) {
          showPhotos.push(item);
        }
      });   //找出有权限删除的图片

    } else {

      type = false
      originPhotos = [];
      showPhotos = this.data.originPhotos;
    }

    this.setData({
      deletePhotoIds: [],
      deleteStatus: type,
      photos: showPhotos,
      originPhotos: originPhotos
    });
  },

  deleteCheckBoxChange: function (e) {
    console.log('deleteCheckBoxChange', e);
    let deleteIdsArray = e.detail.value;
    console.log('deleteIdsArray', deleteIdsArray);
    this.setData({
      deletePhotoIds: deleteIdsArray
    })

  },


  deletePhoto: function (e) {

    console.log(e)
    return;
    let index = e.currentTarget.dataset.index;

    if (index !== undefined) {
      let photo = this.data.photos[index];
      let photos = this.data.photos;
      photos.splice(index, 1);
      this.setData({
        photos: photos,
        deletePhotoIds: this.data.deletePhotoIds.concat(photo.photo_id)
      })
    }

  },

  commitDelete: function (e) {

    let that = this;
    deletePhotoPromise({
      photoIds: this.data.deletePhotoIds,
      album_id: this.data.album.album_id
    }).then(result => {

      console.log(result)
      result.forEach(item => {
        item.originUrl = imageView2UrlFormat(item.url);
        item.thumbnailUrl = imageView2UrlFormat(item.url, {
          width: 200,
          height: 200
        });
      })
      that.setData({
        deletePhotoIds: [],
        deleteStatus: false,
        photos: result,
        originPhotos: []
      });

    }).catch(err => {

      console.log(err)
    })
  }

})