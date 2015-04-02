'use strict';

const crypto = require('crypto'),
    firmToken = require('./firmToken.js'),
    unserialize = require('../serialization/unserialize.js'),
    enrichSettings = require('../settings/enrichSettings.js'),
    createError = require('../errorCreation/createError.js');

module.exports = function (settings, cipheredToken, cbk) {
    enrichSettings(settings, function(err, settings){
        if (err) {
            return cbk(err, null);
        }

        decipherToken(settings, cipheredToken, function(err, token){
            if(err){
                return cbk(err, null);
            }

            checkTokenFirm(settings, cipheredToken, function(err, isValid){
                if(err){
                    return cbk(err, null);
                }

                if(!isValid) {
                    return cbk(errorBadCredentials(), null);
                }

                const tokenSet = {
                    userId: token.userId,
                    expiresAtTimestamp: token.expiresAtTimestamp,
                    data: token.data
                };

                if (settings.enableSessionId) {
                    tokenSet.sessionId = token.sessionId
                }

                cbk(null, tokenSet);
            });
        });
    });
};

function checkTokenFirm(settings, cipheredToken, cbk){
    decipherToken(settings, cipheredToken, function(err, tokenSet){
        firmToken(settings, tokenSet.userId, tokenSet.expiresAtTimestamp, tokenSet.data, function(err, firm){
            if(err){
                return cbk(err, null);
            }
            cbk(null, firm === tokenSet.firm);
        });
    });
}


function decipherToken(settings, cipheredToken, cbk){
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
}

function errorBadCredentials () {
    return createError('Bad credentials', 'Credentials are not valid');
}

function errorBadToken () {
    return createError('Bad token', 'Token is not valid');
}
