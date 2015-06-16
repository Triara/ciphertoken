'use strict';

const crypto = require('crypto'),
    createError = require('../errorCreation/createError.js'),
    unserialize = require('../serialization/unserialize.js');

module.exports = (settings, cipheredToken) => {
    let decodedToken;

    if (settings.cipherKeys !== undefined) {
        settings.cipherKeys.forEach(cipherKey => {
            const decipher = crypto.createDecipher(settings.cipherAlgorithm, cipherKey);
            decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);

            try {
                decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
            } catch (err) {

            }
        });

    } else {
        const decipher = crypto.createDecipher(settings.cipherAlgorithm, settings.cipherKey);
        decodedToken = decipher.update(cipheredToken, settings.tokenEncoding, settings.plainEncoding);

        try {
            decodedToken = (decodedToken + decipher.final(settings.plainEncoding));
        } catch (err) {
            return createError('not decoded', 'not possible to decode token')
        }
    }

    return unserialize(decodedToken);
};
