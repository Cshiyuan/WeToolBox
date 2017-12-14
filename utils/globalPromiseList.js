
const Promise = require('../libs/bluebird');

var globalPromiseList = {};
const setGlobalPromise = function (object) {

    let key = object.key || 'tempKey';
    let promise = object.promise || Promise.resolve();
    globalPromiseList[key] = promise;
}

const getGlobalPromise = function (object) {

    let key
    if (object) {
        key = object.key || 'tempKey';
    } else {
        key = 'tempKey';
    }

    let promise = globalPromiseList[key] || Promise.reject();
    delete globalPromiseList[key];
    return promise;

}

module.exports = {

    setGlobalPromise: setGlobalPromise,
    getGlobalPromise: getGlobalPromise,
}
