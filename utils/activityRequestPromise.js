
const { wxRequestPromise } = require('./util');
const {
    INSERT_ACTIVITY_URL,
    GET_ACTIVITY_URL,
    DELETE_ACTIVITY_URL,
    SIGNUP_ACTIVITY_URL,
    PUNCH_ACTIVITY_URL,
    GET_USER_ACTIVITY_URL,
    GET_USER_SIGNUP_ACTIVITY_URL,
    GET_ACTIVITY_SIGNUP_LIST_URL,
    GET_ACTIVITY_PUNCH_LIST_URL,
    CHANGE_ACTIVITY_TYPE_URL
} = require('./config');


/**
 * @description 创建活动
 * @param {{open_id:String, type, title, description, images, position, time, date}} data 
 */
function insertActivityPromise(data) {

    return wxRequestPromise({
        url: INSERT_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 改变活动类型
 * @param {{activity_id:String, type:Int}} data 
 */
function changeActivityTypePromise(data) {

    return wxRequestPromise({
        url: CHANGE_ACTIVITY_TYPE_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}




/**
 * @description 获得活动
 * @param {activity_id} data 
 */
function getActivityPromise(data) {

    return wxRequestPromise({
        url: GET_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 删除活动
 * @param {activity_id} data 
 */
function deleteActivityPromise(data) {

    return wxRequestPromise({
        url: DELETE_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 报名活动
 * @param {activity_id, open_id, extra} data 
 */
function signUpActivityPromise(data) {

    return wxRequestPromise({
        url: SIGNUP_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 打卡活动
 * @param {activity_id, open_id, extra} data 
 */
function punchActivityPromise(data) {

    return wxRequestPromise({
        url: PUNCH_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 获得用户创建的活动
 * @param {open_id} data 
 */
function getUserActivityListPromise(data) {

    return wxRequestPromise({
        url: GET_USER_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 获得用户参与的活动
 * @param {open_id} data 
 */
function getUserSignUpActivityListPromise(data) {

    return wxRequestPromise({
        url: GET_USER_SIGNUP_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 获得活动报名列表
 * @param {activity_id} data 
 */
function getActivitySignListPromise(data) {

    return wxRequestPromise({
        url: GET_USER_SIGNUP_ACTIVITY_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

/**
 * @description 获得活动打卡列表 
 * @param {activity_id} data 
 */
function getActivityPunchListPromise(data) {

    return wxRequestPromise({
        url: GET_ACTIVITY_PUNCH_LIST_URL,
        data: data
    }).then(response => {

        return response.data;
    });
}

module.exports = {

    insertActivityPromise: insertActivityPromise,  //创建活动
    getActivityPromise: getActivityPromise,    //获得活动
    changeActivityTypePromise: changeActivityTypePromise,  // 改变活动类型


    deleteActivityPromise: deleteActivityPromise,  //删除活动
    signUpActivityPromise: signUpActivityPromise,  //报名活动
    punchActivityPromise: punchActivityPromise,  //打卡活动
    getUserActivityListPromise: getUserActivityListPromise,  //获得用户创建的活动列表
    getUserSignUpActivityListPromise: getUserSignUpActivityListPromise,  //获得用户报名的活动列表
    getActivitySignListPromise: getActivitySignListPromise,  //获得活动的报名用户列表
    getActivityPunchListPromise: getActivityPunchListPromise  //获得活动的打卡用户列表 
}