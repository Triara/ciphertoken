'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');


const userId = 'John Spartan';
const dataToEncode = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


const accessTokenCreator = cipherToken(settings);
const validToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

describe('Decode tokens', function () {
    it('Generated token must be decoded back to get original data', () => {
        const decodedToken = accessTokenCreator.decode(validToken);

        should.not.exist(decodedToken.error);
        should.exist(decodedToken.set);

        decodedToken.set.userId.should.be.deep.equal(userId);
        decodedToken.set.data.should.be.deep.equal(dataToEncode);
    });

    it('Should return an expiresAtTimestamp', function () {
        const decodedToken = accessTokenCreator.decode(validToken);

        should.exist(decodedToken.set.expiresAtTimestamp);
    });

    it('ExpiresInTimestamp should be greater than actual time according to settings', () => {
        const customSettings = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey',
            tokenExpirationMinutes : 2
        };

        const accessTokenCreator = cipherToken(customSettings);
        const encodedToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        const decodedToken = accessTokenCreator.decode(encodedToken);

        const expected = new Date().getTime() + customSettings.tokenExpirationMinutes*60*1000;
        const expectedRounded = (expected/(60*1000)).toFixed(1);
        const actualRounded = (decodedToken.set.expiresAtTimestamp/(60*1000)).toFixed(1);

        expectedRounded.should.equal(actualRounded);
    });

    it('Should return an error when trying to decode with invalid firm key', () => {
        const settingsWithDifferentFirmKey = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey'
        };

        const anotherCipherTokenCreator = cipherToken(settingsWithDifferentFirmKey);
        const decodedToken = anotherCipherTokenCreator.decode(validToken);

        should.not.exist(decodedToken.set);
        should.exist(decodedToken.error);
        decodedToken.error.should.be.deep.equal('Bad credentials');
    });

    it('Should return an error when trying to decode with incorrect settings', () => {
        const settingsWithDifferentCipherKey = {
            cipherKey: 'anotherCipherKey123',
            firmKey:  'myFirmKey123'
        };

        const anotherCipherTokenCreator = cipherToken(settingsWithDifferentCipherKey);
        const decodedToken = anotherCipherTokenCreator.decode(validToken);

        should.not.exist(decodedToken.set);
        should.exist(decodedToken.error);
        decodedToken.error.should.be.deep.equal('Bad credentials');
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

        const cipherTokenCreatorWithOneCipherKey = cipherToken(settingsWithOneCipherKey);
        const token = cipherTokenCreatorWithOneCipherKey.create.userId('user-12').encode();

        const cipherTokenCreatorWithSeveralCipherKeys = cipherToken(settingWithSeveralCipherKeys);
        const decodedToken = cipherTokenCreatorWithSeveralCipherKeys.decode(token);

        should.exist(decodedToken.set);
        decodedToken.set.userId.should.equal('user-12');
    });

    it('Should decode tokens firmed with other firm keys included in the settings', function () {
        const cipherKey = 'cipherKey12345',
            usedFirmKey = 'sameFirmKey';

        const settingsWithOneFirmKey = {
            cipherKey: cipherKey,
            firmKey:  usedFirmKey
        };

        const settingWithSeveralFirmKeys = {
            cipherKey: cipherKey,
            firmKeys: ['firstFirmKey', 'secondFirmKey', usedFirmKey]
        };

        const cipherTokenCreatorWithOneFirmKey = cipherToken(settingsWithOneFirmKey);
        const token = cipherTokenCreatorWithOneFirmKey.create.userId('user-124').encode();

        const cipherTokenCreatorWithSeveralFirmKeys = cipherToken(settingWithSeveralFirmKeys);
        const decodedToken = cipherTokenCreatorWithSeveralFirmKeys.decode(token);
        
        should.exist(decodedToken.set);
        decodedToken.set.userId.should.equal('user-124');
    });

    it.skip('Should not decode tokens firmed with other firm keys if the correct one in not included in the settings', function () {
        const cipherKey = 'cipherKey12345',
            usedFirmKey = 'sameFirmKey';

        const settingsWithOneFirmKey = {
            cipherKey: cipherKey,
            firmKey:  usedFirmKey
        };

        const settingWithSeveralFirmKeys = {
            cipherKey: cipherKey,
            firmKeys: ['firstFirmKey', 'secondFirmKey', usedFirmKey + '123456789']
        };

        cipherToken.encode(settingsWithOneFirmKey, 'userId', null, {data: 'here'}, function (err, token) {
            cipherToken.decode(settingWithSeveralFirmKeys, token, function (err, tokenSet) {
                should.exist(err);
                should.not.exist(tokenSet);
            });
        });
    });
});
