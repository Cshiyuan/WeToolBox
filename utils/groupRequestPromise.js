const { wxRequestPromise, wxPromisify } = require('./util');
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

/**
 * 根据shareticket获得openGid
 */
const getShareInfoPromise = wxPromisify(wx.getShareInfo);
function getOpenGIdByShareTicket(shareTicket) {

  // let openGId = openGId;  //帖子id
  return getShareInfoPromise({

    shareTicket: shareTicket
  }).then(result => {

    console.log('getShareInfoPromise result is ', result);
    return decryptDataPromise({
      encryptedData: result.encryptedData,
      iv: result.iv
    })
  })

}


module.exports = {

    decryptDataPromise: decryptDataPromise,  
    deleteUserGroupRelationPromise:deleteUserGroupRelationPromise,
    getGroupListPromise: getGroupListPromise,
    getUserListPromise: getUserListPromise,

    getOpenGIdByShareTicket: getOpenGIdByShareTicket,

}