'use strict';

const crypto = require('crypto'),
    _ = require('lodash'),
    createError = require('../errorCreation/createError.js'),
    unserialize = require('../serialization/unserialize.js');

module.exports = function (settings, cipheredToken) {
    let decodedToken;

    tryToDecipherToken(settings, settings.cipherKey, cipheredToken, function (error, successfullyDecodedToken) {
        if (_.isNull(error)) {
            decodedToken = successfullyDecodedToken;
        }
    });

    if (_.isUndefined(decodedToken)) {
        return errorBadCredentials();
    }

    return unserialize(decodedToken);
};

function tryToDecipherToken(settings, cipherKey, cipheredToken, callback) {
    const decipher = crypto.createDecipher(settings.cipherAlgorithm, cipherKey);
    let decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);

    try {
        decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
    } catch (err) {
        return callback('not decoded')
    }
    callback(null, decodedToken);
}

function errorBadCredentials() {
    return createError('Bad credentials', 'Credentials are not valid');
}
