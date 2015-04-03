'use strict';

const crypto = require('crypto'),
    _ = require('lodash'),
    createError = require('../errorCreation/createError.js'),
    unserialize = require('../serialization/unserialize.js');

module.exports = function (settings, cipheredToken, callback) {
    let decodedToken;
    if (settings.hasOwnProperty('cipherKeys')) {
        _.forEach(settings.cipherKeys, function (singleCipherKey) {
            tryToDecipherToken(settings, singleCipherKey, cipheredToken, function (error, successfullyDecodedToken) {
                if (_.isNull(error)) {
                    decodedToken = successfullyDecodedToken;
                }
            });
        });
        if (_.isUndefined(decodedToken)){
            return callback(errorBadCredentials(), null);
        }
    }

    if (settings.hasOwnProperty('cipherKey')) {
        tryToDecipherToken(settings, settings.cipherKey, cipheredToken, function (error, successfullyDecodedToken) {
            if (_.isNull(error)) {
                decodedToken = successfullyDecodedToken;
            }
        });
        if (_.isUndefined(decodedToken)){
            return callback(errorBadCredentials(), null);
        }
    }

    unserialize(decodedToken, function (err, decodedToken) {
        if(err){
            return callback(err, null);
        }
        callback(null, decodedToken);
    });
};

function tryToDecipherToken (settings, cipherKey, cipheredToken, callback) {
    const decipher = crypto.createDecipher(settings.cipherAlgorithm, cipherKey);
    let decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);

    try {
        decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
    } catch (err) {
        return callback('not decoded')
    }
    callback(null, decodedToken);
}

function errorBadCredentials () {
    return createError('Bad credentials', 'Credentials are not valid');
}
