
const Promise = require('../libs/bluebird');
const wafer = require('../libs/wafer-client-sdk/index');
const { LOGIN_URL } = require('./config');
wafer.setLoginUrl(LOGIN_URL);


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

const formatTimeByMilliSecond = milliSecond => {

  if (milliSecond <= 0)  //距离开始时间小于0，说明已经开始，返回空串 
    return '';

  var hours = Math.floor(milliSecond / (3600 * 1000))

  //计算相差分钟数
  var leave1 = milliSecond % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  return hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
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
  let login = object.login || true;

  return new Promise((resolve, reject) => {
    wafer.request({
      login: login,
      url: url,
      data: data,
      header: header,
      method: method,
      dataType: dataType,
      success: function (response) {

        resolve(response);
      },
      fail: function (err) {

        reject(err);
      }
    });
  });
}

/**
 * @description 成功提示Toast
 * @param {*} object 
 */
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

/**
 * @description 失败提示Toast
 * @param {*} object 
 */
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
  for (let key in object) {
    params = params + key.toString() + '=' + object[key].toString();
  }
  return params;
}


/**
 * @description 计算两个经纬度点的距离
 * @param 
 */
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}


module.exports = {

  showSuccessToast: showSuccessToast,
  showFailToast: showFailToast,
  generateNaviParam: generateNaviParam,

  getDistance: getDistance,

  formatTimeByMilliSecond: formatTimeByMilliSecond,  //毫秒转成格式
  formatTime: formatTime,  //以指定格式获取当前时间
  formatNumber: formatNumber,

  wxPromisify: wxPromisify,  //将原有的小程序接口替换成
  Promise: Promise,    //以bluebird引入的Promise实现
  wxRequestPromise: wxRequestPromise  //一个简单的打包wxRquset

}
