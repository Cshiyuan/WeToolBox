const { wxRequestPromise } = require('./util');
const {
    INSERT_POST_URL,
    DELETE_POST_URL,
    GET_POSTLIST_URL,
    INSERT_COMMENT_URL,
    GET_COMMENTLIST_URL,
    DELETE_COMMENT_URL,
    STAR_POST_URL,
    UNSTAR_POST_URL,
    GET_POSTLIST_ALBUMLIST_URL,
    GET_POST_URL
} = require('./config');


function getPostListAlbumListPromise(data) {
    return wxRequestPromise({
        url: GET_POSTLIST_ALBUMLIST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function getPostPromise(data) {
    return wxRequestPromise({
        url: GET_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}


function starPostPromise(data) {
    return wxRequestPromise({
        url: STAR_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function unStarPostPromise(data) {
    return wxRequestPromise({
        url: UNSTAR_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}


function insertPostPromise(data) {

    return wxRequestPromise({
        url: INSERT_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function deletePostPromise(data) {

    return wxRequestPromise({
        url: DELETE_POST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function deleteCommentPromise(data) {

    return wxRequestPromise({
        url: DELETE_COMMENT_URL,
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

function insertCommentPromise(data) {

    return wxRequestPromise({
        url: INSERT_COMMENT_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function insertCommentPromise(data) {

    return wxRequestPromise({
        url: INSERT_COMMENT_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

function getCommentListPromise(data) {

    return wxRequestPromise({
        url: GET_COMMENTLIST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}





module.exports = {

    deletePostPromise: deletePostPromise,  //删除帖子
    insertPostPromise: insertPostPromise,  //创建帖子
    getPostPromise: getPostPromise,
    getPostListPromise: getPostListPromise,    //获得帖子列表
    insertCommentPromise: insertCommentPromise, //创建评论
    deleteCommentPromise: deleteCommentPromise,  //删除评论
    getCommentListPromise: getCommentListPromise,  //获得评论

    getPostListAlbumListPromise: getPostListAlbumListPromise,
    starPostPromise: starPostPromise,
    unStarPostPromise: unStarPostPromise
}