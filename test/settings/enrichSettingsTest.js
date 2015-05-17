'use strict';

const mockery = require('mockery');
require('chai').should();

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};

describe('Enrich settings', () => {
    it('Should enrich with provided cipherKey and firmKey', () => {
        const defaultSettingsMock = {
            some: 'values'
        };

        const enrichSettings = createEnrichSettings(defaultSettingsMock);

        enrichSettings(settings).should.contain.all.keys(['cipherKey', 'firmKey', 'some']);
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });
});

function createEnrichSettings (defaultSettingsMock) {
    mockery.registerMock('./defaultSettings.js', defaultSettingsMock);

    mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
    });

    return require('../../lib/settings/enrichSettings.js');
}
