const HOST = 'http://localhost:3000';


const LOGIN_URL = HOST + '/login' //登陆地址

const INSERT_ACTIVITY_URL = HOST + '/activity/insertActivity';  //创建活动
const GET_ACTIVITY_URL = HOST + '/activity/getActivity';        //获得活动
const DELETE_ACTIVITY_URL = HOST + '/activity/deleteActivity';  //删除活动
const SIGNUP_ACTIVITY_URL = HOST + '/activity/signUpActivity';  //报名活动
const PUNCH_ACTIVITY_URL = HOST + '/activity/punchActivity';  //打卡活动

const GET_USER_ACTIVITY_URL = HOST + '/activity/getUserActivityList';  //获得用户创建的活动
const GET_USER_SIGNUP_ACTIVITY_URL = HOST + 'activity/getUserSignUpActivity';  //获得用户参与的活动

const GET_ACTIVITY_SIGNUP_LIST_URL = HOST + 'activity/getActivitySignList';  //获得活动报名列表
const GET_ACTIVITY_PUNCH_LIST_URL = HOST + 'activity/getActivityPunchList';  //获得活动打卡列表

module.exports = {

    LOGIN_URL,
    INSERT_ACTIVITY_URL,
    GET_ACTIVITY_URL,
    DELETE_ACTIVITY_URL,
    SIGNUP_ACTIVITY_URL,
    PUNCH_ACTIVITY_URL,
    GET_USER_ACTIVITY_URL,
    GET_USER_SIGNUP_ACTIVITY_URL,
    GET_ACTIVITY_SIGNUP_LIST_URL,
    GET_ACTIVITY_PUNCH_LIST_URL,
}