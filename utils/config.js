
// const HOST = 'http://localhost:3001';
// const HOST = 'http://192.168.31.148:3001'
const HOST = 'https://vendor.chenshyiuan.me';


const LOGIN_URL = HOST + '/login' //登陆地址

const INSERT_ACTIVITY_URL = HOST + '/activity/insertActivity';  //创建活动
const GET_ACTIVITY_URL = HOST + '/activity/getActivity';        //获得活动
const DELETE_ACTIVITY_URL = HOST + '/activity/deleteActivity';  //删除活动
const SIGNUP_ACTIVITY_URL = HOST + '/activity/signUpActivity';  //报名活动
const PUNCH_ACTIVITY_URL = HOST + '/activity/punchActivity';  //打卡活动

const GET_USER_ACTIVITY_URL = HOST + '/activity/getUserActivityList';  //获得用户创建的活动
const GET_USER_SIGNUP_ACTIVITY_URL = HOST + '/activity/getUserSignUpActivity';  //获得用户参与的活动
const GET_ACTIVITY_SIGNUP_LIST_URL = HOST + '/activity/getActivitySignList';  //获得活动报名列表
const GET_ACTIVITY_PUNCH_LIST_URL = HOST + '/activity/getActivityPunchList';  //获得活动打卡列表
const CHANGE_ACTIVITY_TYPE_URL = HOST + '/activity/changeActivityType';  //改变活动类型接口


const INSERT_ALBUM_URL = HOST + '/album/insertAlbum';  //创建相册
const DELETE_ALBUM_URL = HOST + '/album/deleteAlbum';  //删除相册
const GET_ALBUMPHOTOS_URL = HOST + '/album/getAlbumPhotos';  //获得相册
const GET_ALBUMLIST_URL = HOST + '/album/getAlbumList'; //获得相册列表
const INSERT_PHOTO_URL = HOST + '/album/insertPhotoToAlbum';  //插入相册
const DELETE_PHOTO_URL = HOST + '/album/deletePhoto';  //删除特定图片

const INSERT_POST_URL = HOST + '/post/insertPost'; //创建帖子
const DELETE_POST_URL = HOST + '/post/deletePost';  //删除帖子
const GET_POSTLIST_URL = HOST + '/post/getPostList';  //拉取帖子的列表
const INSERT_COMMENT_URL = HOST + '/post/insertComment';  //创建评论
const DELETE_COMMENT_URL = HOST + '/post/deleteComment'; //删除评论
const GET_COMMENTLIST_URL = HOST + '/post/getCommentList'; //拉取评论
const GET_POSTLIST_ALBUMLIST_URL = HOST + '/post/getPostListAndAlbumList'; //拉取评论和帖子

const STAR_POST_URL = HOST + '/post/starPost';  //点赞帖子
const UNSTAR_POST_URL = HOST + '/post/unStarPost'; //不点赞帖子

const PICGZ_URL = 'http://wetoolbox-1252042156.picgz.myqcloud.com' //处理图片的URL

const CosConfig = {
    AppId: '1252042156',
    SecretId: 'AKIDxlU4QclKq68yYvgsSlna6ML3Yquk3o0x',
    SecretKey: 'rV9csvlNlwtc7bw76sRnz86tTs31i8JE',
    Bucket: 'wetoolbox',
    Region: 'gz',
};

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

    CHANGE_ACTIVITY_TYPE_URL,

    //相册相关URL
    INSERT_ALBUM_URL,
    GET_ALBUMPHOTOS_URL,
    INSERT_PHOTO_URL,
    DELETE_PHOTO_URL,
    GET_ALBUMLIST_URL,
    DELETE_ALBUM_URL,

    // 帖子相关URL
    INSERT_POST_URL,
    DELETE_POST_URL,
    GET_POSTLIST_URL,
    INSERT_COMMENT_URL,
    GET_COMMENTLIST_URL,
    DELETE_COMMENT_URL,
    STAR_POST_URL,
    UNSTAR_POST_URL,
    GET_POSTLIST_ALBUMLIST_URL,

    PICGZ_URL,
    CosConfig
}
