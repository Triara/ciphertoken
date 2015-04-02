'use strict';

const createError = require('../errorCreation/createError.js');

module.exports = function (data, callback) {
    let res;
    try {
        res = JSON.stringify(data);
    } catch (e) {
        return callback(serializationError());
    }
    callback(null, res);
};

function serializationError () {
    return createError('Serialization error', 'Error during data serialization');
}
