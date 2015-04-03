'use strict';

const createError = require('../../errorCreation/createError.js');

module.exports = {
    check: function (settings) {
        return typeof settings === 'undefined' || isEmpty(settings);
    },
    returnError: function () {
        return createError('Settings required', 'Settings must have at least cipherKey and firmKey');
    }
};

function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
}
