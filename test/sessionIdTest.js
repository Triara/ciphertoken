'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');

const userId = 'John Spartan',
    dataToEncode = {field1:'a1b2c3d4e5f6'};

const settingsWithSessionId = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123',
    enableSessionId: true
};

describe('SessionId support', function() {

    const accessTokenCreator = cipherToken(settingsWithSessionId);

    it('Token should have a sessionId when enabled', () => {
        const cipheredTokenWithSessionId = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();
        const decodedToken = accessTokenCreator.decode(cipheredTokenWithSessionId.token);

        should.exist(decodedToken.set.sessionId);
    });

    it('By default, token creation do not include session ids', () => {
        const defaultSettings = {
            cipherKey: 'myCipherKey123',
            firmKey:  'myFirmKey123'
        };
        const accessTokenCreator = cipherToken(defaultSettings);
        const cipheredTokenWithoutSessionId = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        const decodedToken = accessTokenCreator.decode(cipheredTokenWithoutSessionId.token);

        should.not.exist(decodedToken.set.sessionId);
    });

    it('Session ids should be different for different tokens', () => {
        const firstToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();
        const secondToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        const firstTokenDecoded = accessTokenCreator.decode(firstToken.token);
        const secondTokenDecoded = accessTokenCreator.decode(secondToken.token);

        firstTokenDecoded.set.sessionId.should.not.equal(secondTokenDecoded.set.sessionId);
    });

    it('New token can be created with a given sessionId', () => {
        const sessionId = 'abc123456';

        const encodedToken = accessTokenCreator.create.userId(userId).data(dataToEncode).sessionId(sessionId).encode();
        const decodedToken = accessTokenCreator.decode(encodedToken.token);

        decodedToken.set.sessionId.should.deep.equal(sessionId);
    });
});
