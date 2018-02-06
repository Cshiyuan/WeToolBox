const { wxRequestPromise } = require('./util');
const {
    INSERT_POST_URL,
    GET_POSTLIST_URL,
    INSERT_COMMENT_URL,
    GET_COMMENTLIST_URL
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

    insertPostPromise: insertPostPromise,  //创建帖子
    getPostListPromise: getPostListPromise,    //获得帖子
    insertCommentPromise: insertCommentPromise, //创建评论
    getCommentListPromise: getCommentListPromise  //获得评论
}