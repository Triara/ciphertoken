'use strict';

const crypto = require('crypto'),
    createError = require('../errorCreation/createError.js'),
    unserialize = require('../serialization/unserialize.js');

module.exports = function (settings, cipheredToken, callback) {
    const decipher = crypto.createDecipher(settings.cipherAlgorithm, settings.cipherKey);
    let decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);

    if (!decodedToken){
        return callback(errorBadToken(), null);
    }

    try {
        decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
    } catch (err) {
        return callback(null, errorBadCredentials())
    }


    unserialize(decodedToken, function (err, decodedToken) {
        if(err){
            return callback(err, null);
        }
        callback(null, decodedToken);
    });
};

function errorBadToken () {
    return createError('Bad token', 'Token is not valid');
}

function errorBadCredentials () {
    return createError('Bad credentials', 'Credentials are not valid');
}
