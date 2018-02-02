// pages/album/listPhoto.js
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
const { PICGZ_URL } = require('../../../utils/config');
const { imageView2UrlFormat } = require('../../../utils/cos')
const { chooseAndUploadImage } = require('../../../utils/cos')
const { insertPhotoPromise, deletePhotoPromise } = require('../../../utils/albumRequestPromise')
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

      console.log(result);

      result.photos.forEach(item => {
        item.originUrl = imageView2UrlFormat(item.url);
        item.thumbnailUrl = imageView2UrlFormat(item.url, {
          width: 200,
          height: 200
        });
      })
      that.setData(result);
      // let photos = result.photos.map(item => {
      //   return imageView2UrlFormat(item.url)
      // })
      // console.log(photos)

    }).catch(error => {

      let result = { "album": { "id": 70, "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "object_id": "", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "title": "5656u56y", "description": "345345534efwe\nwerkwnjer", "extra": "", "create_time": "2018-01-30T13:33:32.000Z" }, "photos": [{ "id": 287, "photo_id": "PH1f749c8f-e8c7-4107-9533-2659073f4b64", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/e90800c8-89a0-4eff-a811-71a7a4b79075.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": false }, { "id": 288, "photo_id": "PH6d008ea6-4a12-433b-9532-de95e1454e78", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/8639806f-0a62-42df-9c8e-77c86e518f99.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": false }, { "id": 289, "photo_id": "PHbff2a914-9e30-4e69-b017-0f1f291fb0f6", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/687445b9-fd48-445c-b0c1-2efd9b4792d5.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": false }, { "id": 290, "photo_id": "PH11cea7b6-f4c6-49a9-80f1-059b09018f69", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/8b554c73-d602-4d81-9ecf-adf924d7d3e2.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": false }, { "id": 291, "photo_id": "PH3deff746-b6d2-4721-9d10-f6f6428fe450", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/592b30bc-7540-4765-8e13-4ad722b06187.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": true }, { "id": 292, "photo_id": "PHedc3c36a-d3c7-4a71-9d3c-def0a2bd43f3", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/4ff188ca-64ee-4308-b0e2-cb5409587543.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": true }, { "id": 293, "photo_id": "PH697f2997-fb43-4260-b339-37342698ab2f", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/53b1c101-bfde-471b-94c2-95df777d0385.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": true }, { "id": 294, "photo_id": "PHc19778bf-62a4-446c-aa9d-70ccb02e3d8e", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/e4e9e354-fd7d-4aac-96e7-c58c3fa0e0bf.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": true }, { "id": 295, "photo_id": "PH7d7f6c10-2b75-485b-b5b1-2cba84a7fdb8", "album_id": "ABa1768d85-7d1e-4d64-b546-663623e52b08", "open_id": "oFFv90KoHsqi9-y-RLYboP9aVbII", "name": "", "url": "/20180130/29f2b697-c602-4507-9d60-f902c0352b19.jpg", "extra": "", "create_time": "2018-01-30T13:33:32.000Z", "nick_name": "shyiuanchen", "gender": 1, "language": "zh_CN", "city": "Shenzhen", "province": "Guangdong", "country": "China", "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/UbnPnFq4libmxNRDeS3QzXtXQUp54sVoaqIeupy7OkjJSe7pumvzPWp3Flm7ZeuRZVDGXkBppW0HOg5D4W2SSlg/0", "isOwner": true }] }
      result.photos.forEach(item => {
        item.originUrl = imageView2UrlFormat(item.url);
        item.thumbnailUrl = imageView2UrlFormat(item.url, {
          width: 200,
          height: 200
        });
      })
      that.setData(result);
      // that.setData(data)
      // that.setData({
      //   photos: [
      //     {

      //     }
      //   ]
      // })
      console.log(error);
    });
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

  deletePhoto: function (e) {

    console.log(e)
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