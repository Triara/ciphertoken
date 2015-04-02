'use strict';

module.exports = {
    cipherAlgorithm: 'aes-256-cbc',
    hmacAlgorithm: 'md5',
    hmacDigestEncoding: 'hex',
    plainEncoding: 'utf8',
    tokenEncoding: 'base64',
    tokenExpirationMinutes: 90,
    enableSessionId: false
};
