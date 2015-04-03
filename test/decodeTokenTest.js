'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');


const userId = 'John Spartan',
    dataToEncode = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


let validToken;
cipherToken.encode(settings, userId, null, dataToEncode, function (err, token) {
    validToken = token;
});


describe('Decode tokens', function () {
    it('Generated token must be decoded back to get original data', function () {
        cipherToken.decode(settings, validToken, function (err, tokenSet) {
            should.not.exist(err);
            should.exist(tokenSet);
            tokenSet.userId.should.deep.equal(userId);
            tokenSet.data.should.deep.equal(dataToEncode);
        });
    });

    it('Should return an expiresAtTimestamp', function () {
        cipherToken.decode(settings, validToken, function (err, tokenSet) {
            should.exist(tokenSet.expiresAtTimestamp);
        });
    });

    it('ExpiresInTimestamp should be greater than actual time according to settings', function () {
        const customSettings = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey',
            tokenExpirationMinutes : 2
        };
        cipherToken.encode(customSettings, userId, null, dataToEncode, function (err, token) {
            cipherToken.decode(customSettings, token, function (err, tokenSet) {
                const expected = new Date().getTime() + customSettings.tokenExpirationMinutes*60*1000,
                    expectedRounded = (expected/(60*1000)).toFixed(),
                    actualRounded = (tokenSet.expiresAtTimestamp/(60*1000)).toFixed();

                expectedRounded.should.equal(actualRounded);
            });
        });
    });

    it('Should return an error when trying to decode with invalid firm key', function () {
        const settingsWithDifferentFirmKey = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey'
        };

        cipherToken.decode(settingsWithDifferentFirmKey, validToken, function (err, tokenSet) {
            should.not.exist(tokenSet);
            should.exist(err);
            err.err.should.be.deep.equal('Bad credentials');
        });
    });

    it('Should return an error when trying to decode with incorrect settings', function () {
        const settingsWithDifferentCipherKey = {
            cipherKey: 'anotherCipherKey123',
            firmKey:  'myFirmKey123'
        };

        cipherToken.decode(settingsWithDifferentCipherKey, validToken, function (err, tokenSet) {
            should.not.exist(tokenSet);
            should.exist(err);
            err.err.should.be.deep.equal('Bad credentials');
        });
    });

    it('Should decode tokens decoded with other cipher keys included in the settings', function () {
        const usedCipherKey = 'cipherKey12345',
            firmKey = 'sameFirmKey';

        const settingsWithOneCipherKey = {
            cipherKey: usedCipherKey,
            firmKey:  firmKey
        };

        const settingWithSeveralCipherKeys = {
            cipherKeys: ['first123', 'second123', usedCipherKey],
            firmKey: firmKey
        };

        cipherToken.encode(settingsWithOneCipherKey, 'userId', null, {data: 'here'}, function (err, token) {
            cipherToken.decode(settingWithSeveralCipherKeys, token, function (err, tokenSet) {
                should.not.exist(err);
                should.exist(tokenSet);
            });
        });
    });
});
