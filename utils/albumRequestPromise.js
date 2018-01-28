const { wxRequestPromise } = require('./util');
const {
    INSERT_ALBUM_URL,
    GET_ALBUM_URL
} = require('./config');

/**
 * @description 创建相册
 * @param {{object_id:String, title:String, description:String, extra:String, photos:Object}} data 
 */
function insertAlbumPromise(data) {

    return wxRequestPromise({
        url: INSERT_ALBUM_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}


/**
 * @description 获得相册
 * @param {{album_id:String}} data 
 */
function getAlbumPromise(data) {

    return wxRequestPromise({
        url: GET_ALBUM_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

module.exports = {

    getAlbumPromise: getAlbumPromise,  //创建相册
    insertAlbumPromise: insertAlbumPromise,    //获得相册
}