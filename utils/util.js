
const Promise = require('../libs/bluebird');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * @description 需要打包成Promise 的小程序接口
 * @param {wx接口} fn 
 */
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}

/**
 * @description 打包后的wxRequest
 * @param {*} object 
 */
function wxRequestPromise(object) {

  let url = object.url || '';
  let data = object.data || {};
  let header = object.header || {};
  let method = object.method || 'POST';  //默认是POST
  let dataType = object.dataType || 'json';

  return wxPromisify(wx.request)({
    url: url,
    data: data,
    header: header,
    method: method,
    dataType: dataType
  });
}

function showSuccessToast(object) {

  let title = '';
  let duration = 2000;
  if (object) {
    title = object.title || '';
    duration = object.duration || 2000;
  }

  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration
  });
}

function showFailToast(object) {

  let title = '网络错误';
  let duration = 2000;
  if (object) {
    title = object.title || '网络错误';
    duration = object.duration || 2000;
  }

  wx.showToast({
    title: title,
    // icon: 'warn',
    image: '/images/error.png',
    duration: duration
  });
}

/**
 * @description 生成可以导航的参数
 * @param {*} object 
 */
function generateNaviParam(object) {

  let params = '?'
  for (key in object) {
    params = params + key.toString() + '=' + object[key].toString;
  }
  return params;
}



module.exports = {

  showSuccessToast: showSuccessToast,
  showFailToast: showFailToast,
  generateNaviParam: generateNaviParam,

  formatTime: formatTime,  //以指定格式获取当前时间
  wxPromisify: wxPromisify,  //将原有的小程序接口替换成
  Promise: Promise,    //以bluebird引入的Promise实现
  wxRequestPromise: wxRequestPromise  //一个简单的打包wxRquset
}
