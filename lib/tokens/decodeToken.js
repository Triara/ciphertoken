'use strict';

const firmToken = require('./firmToken.js'),
    createError = require('../errorCreation/createError.js'),
    decipherToken = require('./decipherToken.js');

module.exports = function (settings, cipheredToken) {
    let decipheredToken = decipherToken(settings, cipheredToken);

    const dataToSerialize = {
        userId: decipheredToken.userId,
        expiresAtTimestamp: decipheredToken.expiresAtTimestamp,
        data: decipheredToken.data
    };

    const tokenFirm = firmToken(settings, settings.firmKey, dataToSerialize);

    if (tokenFirm !== decipheredToken.firm) {
        return errorBadCredentials();
    }

    return {
        'set': createTokenSet(settings, decipheredToken)
    };
};

function createTokenSet(settings, decipheredToken) {
    let tokenSet = {
        'userId': decipheredToken.userId,
        'expiresAtTimestamp': decipheredToken.expiresAtTimestamp
    };

    if (decipheredToken.data !== undefined) {
        tokenSet.data = decipheredToken.data;
    }

    if(settings.enableSessionId) {
        tokenSet.sessionId = decipheredToken.sessionId
    }

    return tokenSet;
}

function errorBadCredentials() {
    return createError('Bad credentials', 'Credentials are not valid');
}
