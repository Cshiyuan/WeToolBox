
const Promise = require('../libs/bluebird');
const wafer = require('../libs/wafer-client-sdk/index');
// const { decryptDataPromise } = require('../utils/groupRequestPromise');
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

  return formatNumber(hours) + ':' + formatNumber(minutes) + ':' + formatNumber(seconds);
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

function timestampFormat(timestamp) {

  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
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

  var isComplete = false;

  let timer = setTimeout(() => {
    // if (!isComplete) {
    showLoading('请求中');
    // }
  }, 3000)


  return new Promise((resolve, reject) => {
    wafer.request({
      login: login,
      url: url,
      data: data,
      header: header,
      method: method,
      dataType: dataType,
      success: function (response) {

        wx.hideLoading();
        // isComplete = true;
        clearTimeout(timer);
        resolve(response);
      },
      fail: function (err) {

        wx.hideLoading();
        // isComplete = true;
        clearTimeout(timer);
        showFailToast();
        reject(err);
      }
    });
  });
}


/**
 * @description 显示Loading
 * @param {*} object 
 */
function showLoading(object) {

  let title;
  if (typeof (object) == 'string') {
    title = object
  }
  if (object.title !== undefined) {
    title = object.title;
  }

  wx.showLoading({
    title: title,
  })

  // setTimeout(function () {
  //   wx.hideLoading()
  // }, 8000)
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
    params = params + key.toString() + '=' + object[key].toString() + '&';
  }
  return params;
}


/**
 * @description 计算两个经纬度点的距离 距离单位为m
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
  return s * 1000;
}

/**
 * @description 显示一些重要的提示
 * @param 
 */
function showTips(title, content) {

  let myTitle = title || '提示';
  let myContent = content || '';

  wx.showModal({
    title: myTitle,
    content: myContent,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        // console.log('用户点击确定')
      } else if (res.cancel) {
        // console.log('用户点击取消')
      }
    }
  })
}


module.exports = {

  showLoading: showLoading,
  showSuccessToast: showSuccessToast,
  showFailToast: showFailToast,
  showTips: showTips,

  generateNaviParam: generateNaviParam,

  getDistance: getDistance,

  formatTimeByMilliSecond: formatTimeByMilliSecond,  //毫秒转成格式
  formatTime: formatTime,  //以指定格式获取当前时间
  formatNumber: formatNumber,
  timestampFormat: timestampFormat,

  wxPromisify: wxPromisify,  //将原有的小程序接口替换成
  Promise: Promise,    //以bluebird引入的Promise实现
  wxRequestPromise: wxRequestPromise,  //一个简单的打包wxRquset

}
