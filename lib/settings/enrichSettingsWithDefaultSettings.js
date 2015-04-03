'use strict';

const defaultSettings = require('./defaultSettings.js');

module.exports = function  (originalSettings) {
    for (let p in defaultSettings){
        if (originalSettings.hasOwnProperty(p) === false) {
            originalSettings[p] = defaultSettings[p];
        }
    }
    return originalSettings;
};
