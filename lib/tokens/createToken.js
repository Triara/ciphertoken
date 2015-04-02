'use strict';

const enrichSettings = require('../settings/enrichSettings.js'),
    firmToken = require('./firmToken.js'),
    crypto = require('crypto'),
    serialize = require('../serialization/serialize.js');

module.exports = function (settings, userId, sessionId, data, callback) {
    enrichSettings(settings, function(err, settings){
        if(err){
            return callback(err, null);
        }
        const expiresAtTimestamp = new Date().getTime() + settings.tokenExpirationMinutes*60*1000;
        data = data || {};

        firmToken(settings, userId, expiresAtTimestamp, data, function(err, firm){
            if(err){
                return callback(err, null);
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
                    return callback(err, null);
                }
                const encodedData = cipher.update(notFirmedToken, settings.plainEncoding, settings.tokenEncoding);

                callback(null, standarizeToken(encodedData + cipher.final(settings.tokenEncoding)));
            });
        });
    });
};

function standarizeToken(token){
    return token.
        replace(/\+/g, '-'). 	// Convert '+' to '-'
        replace(/\//g, '_'). 	// Convert '/' to '_'
        replace(/=+$/, '')      // Remove ending '='
        ;
}
