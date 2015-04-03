'use strict';

const settingsRequired = require('./checksBeforeEnrichingSettings/settingsRequired.js'),
    cipherKeyRequired = require('./checksBeforeEnrichingSettings/cipherKeyRequired.js'),
    firmKeyRequired = require('./checksBeforeEnrichingSettings/firmKeyRequired.js'),
    enrichSettingsWithDefaultSettings = require('./enrichSettingsWithDefaultSettings');

module.exports = function (settings, callback){
    if (settingsRequired.check(settings)){
        return callback(settingsRequired.returnError());
    }

    if (cipherKeyRequired.check(settings)) {
        return callback(cipherKeyRequired.returnError());
    }

    if (firmKeyRequired.check(settings)) {
        return callback(firmKeyRequired.returnError());
    }

    if (settings.hasOwnProperty('cipherKeys')) {
        settings.cipherKey = settings.cipherKeys[0];
    }

    if (settings.hasOwnProperty('firmKeys')) {
        settings.firmKey = settings.firmKeys[0];
    }

    settings = enrichSettingsWithDefaultSettings(settings);

    callback(null, settings);
};
