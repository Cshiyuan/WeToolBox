const { wxRequestPromise } = require('./util');
const {
    INSERT_POST_URL,
    GET_POSTLIST_URL
} = require('./config');


function insertPostPromise(data) {

    return wxRequestPromise({
        url: INSERT_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}


function getPostListPromise(data) {

    return wxRequestPromise({
        url: GET_POSTLIST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}



module.exports = {

    insertPostPromise: insertPostPromise,  //创建相册
    getPostListPromise: getPostListPromise,    //获得相册
}