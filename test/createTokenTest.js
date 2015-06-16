'use strict';

const should = require('chai').should(),
    expect = require('chai').expect,
    cipherToken = require('../lib/index.js'),
    _ = require('lodash');


const userId = 'John Spartan',
    dataToEncode = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


describe('Token creation', () => {
    it('Should generate token', () => {
        const accessTokenCreator = cipherToken(settings);
        const cipheredToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        should.exist(cipheredToken.token);
        should.not.exist(cipheredToken.error);
    });

    it('Should generate token when data is missing', () => {
        const accessTokenCreator = cipherToken(settings);

        const cipheredToken = accessTokenCreator.create.userId(userId).encode();
        const decodedToken = accessTokenCreator.decode(cipheredToken);

        decodedToken.set.userId.should.deep.equal(userId);
        expect(decodedToken.set.data).to.equal(undefined);
    });

    it('Should not generate token when user id is missing', () => {
        const accessTokenCreator = cipherToken(settings);
        const cipheredToken = accessTokenCreator.create.data(dataToEncode).encode();

        should.not.exist(cipheredToken.token);
        should.exist(cipheredToken.error);
    });

    it('Should not contain +, / and = symbols', () => {
        const accessTokenCreator = cipherToken(settings);
        const cipheredToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        cipheredToken.token.should.not.contain('+');
        cipheredToken.token.should.not.contain('/');
        cipheredToken.token.should.not.contain('=');
    });


    it('Should return an error when trying to create a token with undefined settings', () => {
        const accessTokenCreator = cipherToken();

        should.exist(accessTokenCreator.error);
        accessTokenCreator.error.should.equal('settings must be provided');
    });

    it('Should return an error when trying to create a token with null settings', () => {
        const accessTokenCreator = cipherToken(null);

        should.exist(accessTokenCreator.error);
        accessTokenCreator.error.should.equal('settings must be provided');
    });

    it('Should return an error when cipherKey is missing', () => {
        const settingWithoutCipherKey = _.cloneDeep(settings);
        delete settingWithoutCipherKey.cipherKey;

        const accessTokenCreator = cipherToken(settingWithoutCipherKey);

        should.exist(accessTokenCreator.error);
        accessTokenCreator.error.should.equal('cipherKey required');
    });

    it('Should return an error when firmKey is missing', () => {
        const settingWithoutCipherKey = _.cloneDeep(settings);
        delete settingWithoutCipherKey.firmKey;

        const accessTokenCreator = cipherToken(settingWithoutCipherKey);

        should.exist(accessTokenCreator.error);
        accessTokenCreator.error.should.equal('FirmKey required');
    });

    it('Should accept an array of cipher keys', () => {
        const settingsWithSeveralCipherKeys = {
            cipherKeys: ['myFirstCipherKey123', 'mySecondCipherKey123'],
            firmKey:  'myFirmKey123'
        };

        const accessTokenCreator = cipherToken(settingsWithSeveralCipherKeys);
        const cipheredToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        should.exist(cipheredToken.token);
        should.not.exist(cipheredToken.error);
    });

    it('Should accept an array of firm keys', () => {
        const settingsWithSeveralFirmKeys = {
            cipherKey: 'myFirstCipherKey123',
            firmKeys:  ['myFirstFirmKey123', 'mySecondFirmKey123']
        };

        const accessTokenCreator = cipherToken(settingsWithSeveralFirmKeys);
        const cipheredToken = accessTokenCreator.create.userId(userId).data(dataToEncode).encode();

        should.exist(cipheredToken.token);
        should.not.exist(cipheredToken.error);
    });
});
