"use strict";

const enrichSettings = require('./settings/enrichSettings.js'),
    encodeToken = require('./tokens/createToken.js'),
    decodeToken = require('./tokens/decodeToken.js'),
    _ = require('lodash');

module.exports = (providedSettings) => {
    const enrichedSettings = enrichSettings(providedSettings);
    if (enrichedSettings.error !== undefined) {
        return {error: enrichedSettings.error};
    }

    return tokenGenerator(enrichedSettings);
};

function tokenGenerator (settings) {
    return {
        set: function () {
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
        }(),
        decode: (encodedToken) => {return decodeToken(settings, encodedToken.token)}
    };
}
