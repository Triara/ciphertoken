"use strict";

const crypto = require('crypto'),
    firmToken = require('./firmToken.js'),
    serialize = require('./serialization/serialize.js'),
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

function standarizeToken(token){
    return token.
        replace(/\+/g, '-'). 	// Convert '+' to '-'
        replace(/\//g, '_'). 	// Convert '/' to '_'
        replace(/=+$/, '')      // Remove ending '='
        ;
}

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

function createToken(settings, userId, sessionId, data, cbk) {
    enrichSettings(settings, function(err, settings){
        if(err){
            return cbk(err, null);
        }
        const expiresAtTimestamp = new Date().getTime() + settings.tokenExpirationMinutes*60*1000;
        data = data || {};

        firmToken(settings, userId, expiresAtTimestamp, data, function(err, firm){
            if(err){
                return cbk(err, null);
            }
            const cipher = crypto.createCipher(settings.cipherAlgorithm, settings.cipherKey);

            const tokenSet = {
                userId: userId,
                expiresAtTimestamp: expiresAtTimestamp,
                data: data,
                firm: firm
            };
            if (settings.enableSessionId) {
                if (sessionId == null) {
                    tokenSet.sessionId = userId + '-' + crypto.pseudoRandomBytes(12).toString('hex');
                } else {
                    tokenSet.sessionId = sessionId;
                }
            }

            serialize(tokenSet, function(err, notFirmedToken){
                if(err){
                    return cbk(err, null);
                }
                const encodedData = cipher.update(notFirmedToken, settings.plainEncoding, settings.tokenEncoding);

                cbk(null, standarizeToken(encodedData + cipher.final(settings.tokenEncoding)));
            });
        });
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

// TODO: Use jwt instead of crypto for token encoding
