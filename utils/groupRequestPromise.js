const { wxRequestPromise } = require('./util');
const {
    DECRYDATA_URL,
    GET_USERLIST_BY_GROUP,
    GET_GROUPLIST_BY_USER,
    DELETE_USERGROUP_RELATION
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

/**
 * @description 解密数据
 * @param 
 */
function getUserListPromise(data) {

    return wxRequestPromise({
        url: GET_USERLIST_BY_GROUP,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 解密数据
 * @param 
 */
function getGroupListPromise(data) {

    return wxRequestPromise({
        url: GET_GROUPLIST_BY_USER,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 解密数据
 * @param 
 */
function deleteUserGroupRelationPromise(data) {

    return wxRequestPromise({
        url: DELETE_USERGROUP_RELATION,
        data: data
    }).then(response => {

        return response.data;
    });
}



module.exports = {

    decryptDataPromise: decryptDataPromise,  
    deleteUserGroupRelationPromise:deleteUserGroupRelationPromise,
    getGroupListPromise: getGroupListPromise,
    getUserListPromise: getUserListPromise

}