'use strict';

const serialize = require('./../serialization/serialize.js'),
    crypto = require('crypto');

module.exports = function (settings, firmKey, dataToSerialize, callback) {
    serialize(dataToSerialize, function (err, notFirmedToken) {
        if(err){
            return callback(err, null);
        }
        const firmedToken = crypto.createHmac(settings.hmacAlgorithm, firmKey)
            .update(notFirmedToken)
            .digest(settings.hmacDigestEncoding);
        callback(null, firmedToken);
    });
};
