'use strict';

const createError = require('../../errorCreation/createError.js');

module.exports = {
    check: function (settings) {
        return !settings.hasOwnProperty('firmKey');
    },
    returnError: function () {
        return createError('FirmKey required', 'FirmKey parameter is mandatory')
    }
};
