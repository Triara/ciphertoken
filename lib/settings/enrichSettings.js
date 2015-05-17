'use strict';

const defaultSettings = require('./defaultSettings.js');

module.exports = function (settings){
    if (settings === undefined || settings === null) {
        return {error: 'settings must be provided'}
    }

    if (settings.cipherKeys === undefined && (settings.cipherKey === undefined || settings.cipherKey === null)) {
        return {error: 'cipherKey required'}
    }
    if (Array.isArray(settings.cipherKeys)) {
        settings.cipherKey = settings.cipherKeys[0];
    }

    if (settings.firmKeys === undefined && (settings.firmKey === undefined || settings.firmKey === null)) {
        return {error: 'FirmKey required'}
    }
    if (Array.isArray(settings.firmKeys)) {
        settings.firmKey = settings.firmKeys[0];
    }

    for (let p in defaultSettings){
        if (settings.hasOwnProperty(p) === false) {
            settings[p] = defaultSettings[p];
        }
    }

    return settings;
};
