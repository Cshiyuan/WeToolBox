// pages/album/listAlbum/listAlbum.js
const { getAlbumListPromise, insertAlbumPromise } = require('../../../utils/albumRequestPromise');
const { imageView2UrlFormat } = require('../../../utils/cos');
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
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
    let activity_id = options.activity_id;
    if (activity_id) {
      this.setData({
        activity_id: activity_id,
      });
      let that = this;
      getAlbumListPromise({
        activity_id: activity_id
      }).then(result => {

        result.forEach(item => {
          item.cover = imageView2UrlFormat(item.cover, {
            width: 400,
            height: 400
          });
        })
        that.setData({
          albumList: result
        });
        console.log(result);

      }).catch(err => {
        console.log(err)
      })
    }
  },





  /**
   * 跳转到相册详情页
   */
  naviToPhotoList: function (e) {
    // let index = e.detail
    console.log('naviToPhotoList', e);
    let index = e.currentTarget.dataset.index;
    if (index !== undefined) {

      let url = '/pages/album/listPhoto/listPhoto';
      let param = generateNaviParam({
        album_id: this.data.albumList[index].album_id,
      });

      wx.navigateTo({
        url: url + param
      });
    }
  },

  showInputDialog: function (e) {
    this.inputDialog.show();
  },

  createAlbum: function (e) {
    let value = e.detail.value;
    console.log('createAlbum', value);
    insertAlbumPromise({
      object_id: this.data.activity_id,
      title: value
    }).then(result => {

      let album = result.album;
      // console.log(result)
    }).catch(err => {

      console.log(err)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化组件
    this.inputDialog = this.selectComponent("#inputDialog");
    // this.asynSwitch.setSwitchStatus(this.data.isStopPunch);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})