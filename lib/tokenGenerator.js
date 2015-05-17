'use strict';

const encodeToken = require('./tokens/createToken.js'),
    decodeToken = require('./tokens/decodeToken.js');

module.exports = (settings) => {
    return {
        'set': setTokenProperties(settings),
        'decode': (encodedToken) => {return decodeToken(settings, encodedToken.token)}
    };
};

function setTokenProperties (settings) {
    let tokenProperties = {};
    function userId (providedUserId) {
        tokenProperties.userId = providedUserId;
        return this;
    }

    function data (providedData) {
        tokenProperties.data = providedData;
        return this;
    }

    function sessionId (providedSessionId) {
        tokenProperties.sessionId = providedSessionId;
        return this;
    }

    return {
        userId: userId,
        data: data,
        sessionId: sessionId,
        encode: function() {
            return encodeToken(settings, tokenProperties);
        }
    }
}
