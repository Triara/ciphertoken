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

let tokenWithSessionId;
cipherToken.encode(settingsWithSessionId, userId, null, dataToEncode, function (err, token) {
    tokenWithSessionId = token;
});


describe('SessionId support', function() {
    it('Token should have a sessionId when enabled', function (done) {
        cipherToken.decode(settingsWithSessionId, tokenWithSessionId, function (err, tokenSet) {
            should.exist(tokenSet.sessionId);
            done();
        });
    });

    it('By default, token creation do not include session ids', function (done) {
        const defaultSettings = {
            cipherKey: 'myCipherKey123',
            firmKey:  'myFirmKey123'
        };

        cipherToken.encode(defaultSettings, userId, null, dataToEncode, function (err, token) {
            cipherToken.decode(defaultSettings, token, function (err, tokenSet) {
                should.not.exist(tokenSet.sessionId);
                done();
            });
        });
    });

    it('Session ids should be different for different tokens', function() {
        let firstSessionId = '',
            secondSessionId = '';

        cipherToken.encode(settingsWithSessionId, 'first user', null, dataToEncode, function(err, token){
            cipherToken.decode(settingsWithSessionId, token, function (err, tokenSet) {
                firstSessionId = tokenSet.sessionId;
            })
        });
        cipherToken.encode(settingsWithSessionId, 'second user', null, dataToEncode, function (err, token) {
            cipherToken.decode(settingsWithSessionId, token, function (err, tokenSet) {
                secondSessionId = tokenSet.sessionId;
            })
        });

        firstSessionId.should.not.equal(secondSessionId);
    });

    it('New token can be created with a given sessionId', function () {
        const sessionId = 'abc123456';

        cipherToken.encode(settingsWithSessionId, userId, sessionId, dataToEncode, function (err, token) {
            cipherToken.decode(settingsWithSessionId, token, function (err, tokenSet) {
                tokenSet.sessionId.should.deep.equal(sessionId);
            });
        });
    });
});
