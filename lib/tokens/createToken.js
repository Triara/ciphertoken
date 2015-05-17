'use strict';

const crypto = require('crypto'),
    serialize = require('../serialization/serialize.js'),
    createTokenSet = require('./tokenSet/createTokenSet.js');

module.exports = function (settings, tokenProperties) {
    const tokenSet = createTokenSet(settings, tokenProperties);
    const serializedToken = serialize(tokenSet);

    const cipher = crypto.createCipher(settings.cipherAlgorithm, settings.cipherKey);
    const encodedData = cipher.update(serializedToken, settings.plainEncoding, settings.tokenEncoding);
    return {token: standardizeToken(encodedData + cipher.final(settings.tokenEncoding))};
};

function standardizeToken(token) {
    return token.
        replace(/\+/g, '-'). 	// Convert '+' to '-'
        replace(/\//g, '_'). 	// Convert '/' to '_'
        replace(/=+$/, '')      // Remove ending '='
        ;
}
