'use strict';

const createError = require('../errorCreation/createError.js');

module.exports = function (data, callback) {
    let res;
    try {
        res = JSON.parse(data);
    } catch (error) {
        return callback(unserializationError());
    }
    callback(null, res);
};

function unserializationError () {
    return createError('Unserialization error', 'Error during data unserialization');
}
