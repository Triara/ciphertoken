'use strict';

const serialize = require('./../serialization/serialize.js'),
    crypto = require('crypto');

module.exports = function (settings, userId, expiresAtTimestamp, data, callback) {
    const dataToSerialize = {
        'userId': userId,
        'expiresAtTimestamp': expiresAtTimestamp,
        'data': data
    };

    serialize(dataToSerialize, function (err, notFirmedToken) {
        if(err){
            return callback(err, null);
        }
        const firmedToken = crypto.createHmac(settings.hmacAlgorithm, settings.firmKey)
            .update(notFirmedToken)
            .digest(settings.hmacDigestEncoding);
        callback(null, firmedToken);
    });
};
