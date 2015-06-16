'use strict';

const serialize = require('./../serialization/serialize.js'),
    crypto = require('crypto');

module.exports = (settings, firmKey, dataToSerialize) => {
    const notFirmedToken = serialize(dataToSerialize);

    return crypto.createHmac(settings.hmacAlgorithm, firmKey)
        .update(notFirmedToken)
        .digest(settings.hmacDigestEncoding);
};
