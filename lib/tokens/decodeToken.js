'use strict';

const firmToken = require('./firmToken.js'),
    _ = require('lodash'),
    enrichSettings = require('../settings/enrichSettings.js'),
    createError = require('../errorCreation/createError.js'),
    decipherToken = require('./decipherToken.js');

module.exports = function (settings, cipheredToken, callback) {
    enrichSettings(settings, function (err, settings) {
        if (err) {
            return callback(err, null);
        }

        decipherToken(settings, cipheredToken, function (err, token) {
            if(err){
                return callback(err, null);
            }

            let foundCorrectFirm;
            if (settings.hasOwnProperty('firmKeys')) {
                _.forEach(settings.firmKeys, function (singleFirmKey) {
                    if (isTokenFirmValid(settings, singleFirmKey, token)) {
                        foundCorrectFirm = true;
                    }
                });
            }

            if (settings.hasOwnProperty('firmKey')) {
                if (isTokenFirmValid(settings, settings.firmKey, token)) {
                    foundCorrectFirm = true;
                }
            }

            if (!_.isUndefined(foundCorrectFirm) === false) {
                return callback(errorBadCredentials(), null);
            }

            const tokenSet = {
                userId: token.userId,
                expiresAtTimestamp: token.expiresAtTimestamp,
                data: token.data
            };

            if (settings.enableSessionId) {
                tokenSet.sessionId = token.sessionId
            }

            callback(null, tokenSet);
        });
    });
};

function isTokenFirmValid(settings, firmKey, decipheredToken){
    let isTokenValid;
    firmToken(settings, firmKey, decipheredToken.userId, decipheredToken.expiresAtTimestamp, decipheredToken.data, function (err, firm) {
        isTokenValid = firm === decipheredToken.firm;
    });
    return isTokenValid;
}

function errorBadCredentials () {
    return createError('Bad credentials', 'Credentials are not valid');
}
