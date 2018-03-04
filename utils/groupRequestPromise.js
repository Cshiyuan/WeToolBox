const { wxRequestPromise } = require('./util');
const {
    DECRYDATA_URL,
} = require('./config');


/**
 * @description 解密数据
 * @param 
 */
function decryptDataPromise(data) {

    return wxRequestPromise({
        url: DECRYDATA_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

module.exports = {

    decryptDataPromise: decryptDataPromise,  
}