
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


module.exports = {
  formatTime: formatTime,  //以指定格式获取当前时间
  wxPromisify: wxPromisify,  //将原有的小程序接口替换成
  Promise: Promise    //以bluebird引入的Promise实现
}
