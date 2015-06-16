'use strict';

const createError = require('../errorCreation/createError.js');

module.exports = data => {
    let response;

    try {
        response = JSON.parse(data);
    } catch (error) {
        return unserializationError(error);
    }

    return response;
};

function unserializationError (error) {
    return createError('Unserialization error', 'Error during data unserialization: ' + error);
}
