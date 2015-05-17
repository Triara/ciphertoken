'use strict';

const firmToken = require('./firmToken.js'),
    crypto = require('crypto'),
    serialize = require('../serialization/serialize.js'),
    uuid = require('node-uuid');

module.exports = function (settings, tokenProperties) {
    const tokenSet = createTokenSet(settings, tokenProperties);
    const serializedToken = serialize(tokenSet);

    const cipher = crypto.createCipher(settings.cipherAlgorithm, settings.cipherKey);
    const encodedData = cipher.update(serializedToken, settings.plainEncoding, settings.tokenEncoding);
    return {token: standarizeToken(encodedData + cipher.final(settings.tokenEncoding))};
};


function createTokenSet (settings, tokenProperties) {
    const expiresAtTimestamp = createExpiresAtTimestamp(settings.tokenExpirationMinutes);
    const dataToSerialize = createDataToSerialize(tokenProperties.userId, expiresAtTimestamp, tokenProperties.data);

    let tokenSet = {
        userId: tokenProperties.userId,
        expiresAtTimestamp: expiresAtTimestamp,
        data: tokenProperties.data,
        firm: firmToken(settings, settings.firmKey, dataToSerialize)
    };

    if (settings.enableSessionId) {
        tokenSet.sessionId = addSessionId(tokenProperties);
    }

    return tokenSet;
}

function addSessionId(tokenProperties) {
    if (tokenProperties.sessionId !== undefined) {
        return tokenProperties.sessionId;
    }
    return uuid.v4();
}

function createExpiresAtTimestamp(tokenExpirationMinutes) {
    return new Date().getTime() + tokenExpirationMinutes * 60 * 1000;
}

function createDataToSerialize(userId, expiresAtTimestamp, data) {
    return {
        userId: userId,
        expiresAtTimestamp: expiresAtTimestamp,
        data: data
    }
}
function standarizeToken(token) {
    return token.
        replace(/\+/g, '-'). 	// Convert '+' to '-'
        replace(/\//g, '_'). 	// Convert '/' to '_'
        replace(/=+$/, '')      // Remove ending '='
        ;
}
