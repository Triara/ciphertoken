'use strict';

const createError = require('../errorCreation/createError.js');

module.exports = function (data) {
    let response;

    try {
        response = JSON.stringify(data);
    } catch (error) {
        return serializationError(error);
    }

    return response;
};

function serializationError (error) {
    return createError('Serialization error', 'Error during data serialization: ' + error);
}
