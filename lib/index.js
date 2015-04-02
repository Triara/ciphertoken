"use strict";

const createToken = require('./tokens/createToken.js'),
    crypto = require('crypto'),
    firmToken = require('./tokens/firmToken.js'),
    unserialize = require('./serialization/unserialize.js'),
    enrichSettings = require('./settings/enrichSettings.js');

const ERRORS = {
    badCredentials: {
        err: 'Bad credentials',
        des: 'Credentials are not valid'
    },
    badToken: {
        err: 'Bad token',
        des: 'Token is not valid'
    }
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
        return cbk(ERRORS.badToken, null);
    }

    try{
        decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
    }catch (err) {
        return cbk(null, ERRORS.badCredentials)
    }


    unserialize(decodedToken, function(err, decodedToken){
        if(err){
            return cbk(err, null);
        }
        cbk(null, decodedToken);
    });
}


function decodeToken(settings, cipheredToken, cbk){
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
                    return cbk(ERRORS.badCredentials, null);
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
}

module.exports = {
    encode: createToken,
    decode: decodeToken,
    getTokenSet: decodeToken,
    createToken: createToken
};
