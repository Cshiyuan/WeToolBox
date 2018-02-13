const { wxRequestPromise } = require('./util');
const {
    INSERT_ALBUM_URL,
    GET_ALBUMPHOTOS_URL,
    INSERT_PHOTO_URL,
    DELETE_PHOTO_URL,
    GET_ALBUMLIST_URL
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
 * @description 获得相册里的图片
 * @param {{album_id:String}} data 
 */
function getAlbumPromise(data) {

    return wxRequestPromise({
        url: GET_ALBUMPHOTOS_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function getAlbumListPromise(data) {

    return wxRequestPromise({
        url: GET_ALBUMLIST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}



/**
 * @description 获得相册
 * @param {{photos:Object, album_id: String}} data 
 */
function insertPhotoPromise(data) {

    return wxRequestPromise({
        url: INSERT_PHOTO_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}


/**
 * @description 获得相册
 * @param {{photoIds:Array, album_id: String}} data 
 */
function deletePhotoPromise(data) {

    return wxRequestPromise({
        url: DELETE_PHOTO_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

module.exports = {

    getAlbumPromise: getAlbumPromise,  
    getAlbumListPromise: getAlbumListPromise,  //获得相册列表
    insertAlbumPromise: insertAlbumPromise,    //获得相册
    insertPhotoPromise: insertPhotoPromise,  //创建相册
    deletePhotoPromise: deletePhotoPromise
}