'use strict';

const encodeToken = require('./tokens/createToken.js'),
    decodeToken = require('./tokens/decodeToken.js'),
    createError = require('./errorCreation/createError.js');

module.exports = settings => {
    return {
        'set': setTokenProperties(settings),
        'decode': encodedToken => decodeToken(settings, encodedToken.token)
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
        encode: () => {
            if (tokenProperties.userId === undefined) {
                return createError('Missing user id', 'User id is a mandatory param when creating tokens')
            }
            return encodeToken(settings, tokenProperties);
        }
    }
}
