const Promise = require('../libs/bluebird');
const { PICGZ_URL, CosConfig } = require('../utils/config')
const CryptoJS = require('../libs/crypto');
const { formatNumber } = require('../utils/util');
const uuidv4 = require('../libs/we-uuidv4')

let appId = CosConfig.AppId;
let bucket = CosConfig.Bucket;
let secretId = CosConfig.SecretId;
let secretkey = CosConfig.SecretKey;

const COSAPI_CGI_URL = "https://REGION.file.myqcloud.com/files/v2/";

function getSignature(once) {

    var appid = '1252042156';
    var bucket = 'wetoolbox';
    var sid = 'AKIDuiQ8exsygL0UpyreGqIX5UDpKnASuOCs';
    var skey = 'c2HNNGxSvCH9rTwCLI3bw52pPnzylY9b';

    var random = parseInt(Math.random() * Math.pow(2, 32));
    var now = parseInt(new Date().getTime() / 1000);
    var e = now + 60; //签名过期时间为当前+60s
    var path = ''; //多次签名这里填空

    var str = 'a=' + appId + '&k=' + secretId + '&e=' + e + '&t=' + now + '&r=' + random +
        '&f=' + path + '&b=' + bucket;

    var sha1Res = CryptoJS.HmacSHA1(str, secretkey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
    var strWordArray = CryptoJS.enc.Utf8.parse(str);
    var resWordArray = sha1Res.concat(strWordArray);
    var res = resWordArray.toString(CryptoJS.enc.Base64);
    return res;
};

//处理路径
function fixPath(path, type) {

    if (!path) {
        return '';
    }
    var self = this;
    path = path.replace(/(^\/*)|(\/*$)/g, '');
    if (type == 'folder') {
        path = encodeURIComponent(path + '/').replace(/%2F/g, '/');
    } else {
        path = encodeURIComponent(path).replace(/%2F/g, '/');
    }

    if (self) {
        self.path = '/' + self.appid + '/' + self.bucket + '/' + path;
    }

    return path;
}

function getCgiUrl(destPath) {

    var region = CosConfig.Region;
    var bucket = CosConfig.Bucket;
    let appId = CosConfig.AppId;
    var url = COSAPI_CGI_URL;
    url = url.replace('REGION', region);

    return url + appId + '/' + bucket + '/' + destPath;
};

let uploadFile = function (opts) {

    let onProgress = opts.onProgress;
    let success = opts.success || {};
    let error = opts.error || {};
    let insertOnly = opts.insertOnly || 1;
    let bizAttr = opts.bizAttr || '';
    let filePath = opts.filePath || '';

    let date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    let remotePath = '/' + formatNumber(year) + formatNumber(month) + formatNumber(day) + '/'
    let tmpArray = filePath.split('.');
    let fileMark = uuidv4() + '.' + tmpArray[tmpArray.length - 1]  //UUID生成文件名
    remotePath = remotePath + fileMark; //生成存储文位置

    remotePath = fixPath(remotePath);
    let sign = getSignature();
    var url = getCgiUrl(remotePath);
    var data = {
        op: 'upload'
    };
    if (insertOnly >= 0) { // insertOnly == 0 表示允许覆盖文件 1表示不允许 其他值忽略
        data['insertOnly'] = insertOnly;
    }
    if (bizAttr) {
        data['biz_attr'] = bizAttr;
    }
    return new Promise((resolve, reject) => {

        let uploadTask = wx.uploadFile({
            url: url,
            filePath: filePath,
            name: 'fileContent',
            header: { 'Authorization': sign },
            formData: data,
            success: function (result) {
                result.data = JSON.parse(result.data);
                if (result.data.code === 0) {  //有错误码

                    resolve(result)
                } else {

                    reject(result)
                }
            },
            fail: function (err) {

                reject(err)
            }
        });
    })
    // onProgress && uploadTask && uploadTask.onProgressUpdate && uploadTask.onProgressUpdate(onProgress);
};


let uploadImages = function (opts) {

    if (opts.images && opts.images.length) {

        let images = opts.images;
        let promiseArray = []
        images.forEach(item => {
            promiseArray.push(uploadFile({
                filePath: item
            }))
        })
        return Promise.all(promiseArray).then(results => {

            let paths = results.map(item => {
                let tmpArray = item.data.data.resource_path.split('wetoolbox');
                let path = tmpArray[1]
                return path
            })
            console.log(paths);
            return paths;
        })
    } else {
        return Promise.reject('param err')
    }
}

let chooseAndUploadImage = function (opts) {

    let count = opts && opts.count || 9;
    let sizeType = opts && opts.sizeType || ['original', 'compressed'];
    let sourceType = opts && opts.sourceType || ['album', 'camera'];

    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: count,
            sizeType: sizeType,
            sourceType: sourceType,
            success: function (res) {
                if (res.tempFilePaths && res.tempFilePaths.length) {

                    let promiseArray = []
                    res.tempFilePaths.forEach(item => {
                        promiseArray.push(uploadFile({
                            filePath: item
                        }))
                    })
                    Promise.all(promiseArray).then(results => {

                        let paths = results.map(item => {
                            let tmpArray = item.data.data.resource_path.split('wetoolbox');
                            let path = tmpArray[1]
                            return path
                        })
                        console.log(paths);
                        resolve(paths)
                    }).catch(err => {

                        reject(err);
                    })
                }
            }
        });
    })
}


let imageView2UrlFormat = function (url, opts) {

    if (url.indexOf(PICGZ_URL) === -1) {  //未拼接开始拼接
        url = PICGZ_URL + url;
    }

    if (opts) {
        let width = (opts.width && opts.width.toString()) || '';
        let height = (opts.height && opts.height.toString()) || '';
        let quality = (opts.quality && opts.quality.toString()) || '';
        url = url + '?imageView2' + '/' + '0' + '/w/' + width + '/h/' + height + '/q/' + quality;
    }
    return url;
}


module.exports = {

    uploadFile: uploadFile,
    chooseAndUploadImage: chooseAndUploadImage,
    uploadImages: uploadImages,

    imageView2UrlFormat: imageView2UrlFormat
}