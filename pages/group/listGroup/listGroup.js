// pages/group/listGroup/listGroup.js
const {
  getGroupListPromise
} = require('../../../utils/groupRequestPromise');
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

    let that = this;
    getGroupListPromise().then(result => {
      console.log(result);
      that.setData({
        groupList: result
      })
      wx.stopPullDownRefresh();
    }).catch(err => {

      wx.stopPullDownRefresh();
      console.log(err)
    })
  },

  jumpToIndexGroup: function (e) {

    console.log(e);
    let index = e.currentTarget.dataset.index;
    if (index !== undefined) {
      let group = this.data.groupList[index];
      let openGId = group.openg_id || '';

      let url = '/pages/group/indexGroup/indexGroup';
      let param = generateNaviParam({
        openGId: group.openg_id
      });

      wx.navigateTo({
        url: url + param
      });
    }

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
    getGroupListPromise().then(result => {
      console.log(result);
      that.setData({
        groupList: result
      })
      wx.stopPullDownRefresh();
    }).catch(err => {

      wx.stopPullDownRefresh();
      console.log(err)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})