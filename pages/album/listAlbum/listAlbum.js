// pages/album/listAlbum/listAlbum.js
const { getAlbumListPromise, insertAlbumPromise, deleteAlbumPromise } = require('../../../utils/albumRequestPromise');
const { imageView2UrlFormat } = require('../../../utils/cos');
const { timestampFormat, generateNaviParam } = require('../../../utils/util');
const { setGlobalPromise, getGlobalPromise } = require('../../../utils/globalPromiseList');
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
        object_id: activity_id
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
   * 相册长按删除
   */
  longpressAlbum: function (e) {

    console.log('longpressAlbum', e);
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#DC143C',
      success: function (res) {

        if (res.tapIndex === 0) {  //删除
          deleteAlbumPromise({
            album_id: that.data.albumList[index].album_id
          }).then(result => {

            let albumList = that.data.albumList;
            albumList.splice(index, 1)
            that.setData({
              albumList: albumList
            })
          }).catch(err => {

            console.log(err)
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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
      setGlobalPromise({
        promise: Promise.resolve(this.data.albumList[index])
      })
      // let param = generateNaviParam({
      //   album_id: this.data.albumList[index].album_id,
      // });

      wx.navigateTo({
        url: url
      });
    }
  },

  /**
   * 显示输入窗口
   */
  showInputDialog: function (e) {
    this.inputDialog.show();
  },

  /**
   * 创建相册
   */
  createAlbum: function (e) {

    let value = e.detail.value;
    let that = this;
    console.log('createAlbum', value);
    insertAlbumPromise({
      object_id: this.data.activity_id,
      title: value
    }).then(result => {

      let album = result.album;
      album.cover = imageView2UrlFormat(album.cover, {
        width: 400,
        height: 400
      });
      let albumList = that.data.albumList;
      albumList = albumList.concat(album);
      that.setData({
        albumList: albumList
      });

      let pageStacks = getCurrentPages();
      let prePage = pageStacks[pageStacks.length - 2];
      // console.log(prePage);
      // let albumList = prePage.data.albumList;
      // let index = albumList.findIndex((value) => {  //寻找到特定的
      //   if (value.post_id === that.data.post.post_id)
      //     return true;
      // });
      // postList[index].comment = albumList[index].comment + 1;
      prePage.setData({
        albumList: albumList
      });

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

})