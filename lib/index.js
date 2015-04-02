"use strict";

const createToken = require('./tokens/createToken.js'),
    decodeToken = require('./tokens/decodeToken.js');

module.exports = {
    encode: createToken,
    decode: decodeToken,
    getTokenSet: decodeToken,
    createToken: createToken
};
