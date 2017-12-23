// pages/memberList/memberList.js
const { setGlobalPromise, getGlobalPromise } = require('../../utils/globalPromiseList');
const util = require('../../utils/util');
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


      let array = result.map(item => {

        item.create_time = util.formatTime(new Date(item.create_time));
        return item;
      });

      that.setData({
        memberList: result
      });
    }).catch(error => {

      console.log(error);
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

})