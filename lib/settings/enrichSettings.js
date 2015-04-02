'use strict';

const createError = require('../errorCreation/createError.js'),
    defaultSetting = require('./defaultSettings.js');

module.exports = function (settings, callback){
    if (typeof settings === 'undefined' || isEmpty(settings)){
        return callback(errorSettingRequired());
    } else if (!settings.hasOwnProperty('cipherKey')) {
        return callback(errorCipherKeyRequired());
    } else if (!settings.hasOwnProperty('firmKey')) {
        return callback(errorFirmKeyRequired());
    }

    for (let p in defaultSetting){
        if (settings.hasOwnProperty(p) == false) {
            settings[p] = defaultSetting[p];
        }
    }

    callback(null, settings);
};

function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
}

function errorSettingRequired () {
    return createError('Settings required', 'Settings must have at least cipherKey and firmKey');
}

function errorCipherKeyRequired () {
    return createError('CipherKey required', 'CipherKey parameter is mandatory');
}

function errorFirmKeyRequired () {
    return createError('FirmKey required', 'FirmKey parameter is mandatory')
}
