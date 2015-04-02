'use strict';

const crypto = require('crypto'),
    createError = require('../errorCreation/createError.js'),
    unserialize = require('../serialization/unserialize.js');

module.exports = function (settings, cipheredToken, cbk) {
    const decipher = crypto.createDecipher(settings.cipherAlgorithm, settings.cipherKey);
    let decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);
    if (!decodedToken){
        return cbk(errorBadToken(), null);
    }

    try{
        decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
    }catch (err) {
        return cbk(null, errorBadCredentials())
    }


    unserialize(decodedToken, function(err, decodedToken){
        if(err){
            return cbk(err, null);
        }
        cbk(null, decodedToken);
    });
};

function errorBadToken () {
    return createError('Bad token', 'Token is not valid');
}

function errorBadCredentials () {
    return createError('Bad credentials', 'Credentials are not valid');
}
