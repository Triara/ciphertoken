"use strict";

const enrichSettings = require('./settings/enrichSettings.js'),
    tokenGenerator = require('./tokenGenerator.js');

module.exports = (providedSettings) => {
    const enrichedSettings = enrichSettings(providedSettings);
    if (enrichedSettings.error !== undefined) {
        return {error: enrichedSettings.error};
    }

    return tokenGenerator(enrichedSettings);
};
