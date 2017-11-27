
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


// url	String	是		开发者服务器接口地址
// data	Object/String	否		请求的参数
// header	Object	否		设置请求的 header，header 中不能设置 Referer。
// method	String	否	GET	（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
// dataType	String	否	json	如果设为json，会尝试对返回的数据做一次 JSON.parse
// success	Function	否		收到开发者服务成功返回的回调函数
// fail	Function	否		接口调用失败的回调函数
// complete	Function	否		接口调用结束的回调函数（调用成功、失败都会执行）

const wxRequestPromise = wxPromisify(wx.request);

function wxRequestPromise(object) {

  let url = object.url || '';
  let data = object.data || {};
  let header = object || {};
  let method = object || 'POST';  //默认是POST
  let dataType = object.dataType || 'json';

  return wxRequestPromise({
    url: url,
    data: data,
    header: header,
    method: method,
    dataType: dataType
  });
}


module.exports = {
  formatTime: formatTime,  //以指定格式获取当前时间
  wxPromisify: wxPromisify,  //将原有的小程序接口替换成
  Promise: Promise,    //以bluebird引入的Promise实现
  wxRequestPromise: wxRequestPromise  //一个简单的打包wxRquset
}
