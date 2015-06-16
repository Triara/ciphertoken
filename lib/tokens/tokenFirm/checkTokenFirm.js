'use strict';

const firmToken = require('./firmToken.js'),
    _ = require('lodash');

module.exports = (settings, dataToSerialize, decipheredTokenFirm) => {
    if (settings.firmKeys !== undefined) {
        return _.include(_.map(settings.firmKeys, firmKey => {
            return firmToken(settings, firmKey, dataToSerialize)
        }), decipheredTokenFirm);
    }

    return firmToken(settings, settings.firmKey, dataToSerialize) === decipheredTokenFirm;
};
