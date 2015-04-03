'use strict';

const createError = require('../../errorCreation/createError.js');

module.exports = {
    check: function (settings) {
        return !settings.hasOwnProperty('cipherKey') && !settings.hasOwnProperty('cipherKeys');
    },
    returnError: function () {
        return createError('CipherKey required', 'CipherKey parameter is mandatory');
    }
};
