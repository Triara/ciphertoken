'use strict';

const createError = require('../errorCreation/createError.js'),
    decipherToken = require('./decipherToken.js'),
    isTokenFirmCorrect = require('./tokenFirm/checkTokenFirm.js');

module.exports = (settings, cipheredToken) => {
    let decipheredToken = decipherToken(settings, cipheredToken);

    const dataToSerialize = {
        userId: decipheredToken.userId,
        expiresAtTimestamp: decipheredToken.expiresAtTimestamp,
        data: decipheredToken.data
    };

    if (!isTokenFirmCorrect(settings, dataToSerialize, decipheredToken.firm)) {
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
