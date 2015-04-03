'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');


const userId = 'John Spartan',
    dataToEncode = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


describe('Token creation', function () {
    it('Should generate tokens', function() {
        cipherToken.encode(settings, userId, null, dataToEncode, function (err, token) {
            should.not.exist(err);
            should.exist(token);
        });
    });

    it('Should not contain +, / and = symbols', function () {
        cipherToken.encode(settings, userId, null, dataToEncode, function (err, token) {
            token.should.not.contain('+');
            token.should.not.contain('/');
            token.should.not.contain('=');
        });
    });


    it('Should return an error when trying to create a token with empty settings', function () {
        cipherToken.encode({}, userId, null, dataToEncode, function (err) {
            should.exist(err);
            err.err.should.deep.equal('Settings required');
        });
    });

    it('Should return an error when trying to create a token with undefined settings', function () {
        cipherToken.encode(undefined, userId, null, dataToEncode, function (err) {
            should.exist(err);
            err.err.should.deep.equal('Settings required');
        });
    });

    it('Should return an error when cipherKey is missing', function () {
        cipherToken.encode({'firmKey': 'firmKey1234'}, userId, null, dataToEncode, function (err) {
            should.exist(err);
            err.err.should.deep.equal('CipherKey required');
        });
    });

    it('Should return an error when firmKey is missing', function () {
        cipherToken.encode({'cipherKey': 'cipherKey1234'}, userId, null, dataToEncode, function (err) {
            should.exist(err);
            err.err.should.deep.equal('FirmKey required');
        });
    });

    it('Should accept an array of cipher keys', function () {
        const settingsWithSeveralCipherKeys = {
            cipherKeys: ['myFirstCipherKey123', 'mySecondCipherKey123'],
            firmKey:  'myFirmKey123'
        };

        cipherToken.encode(settingsWithSeveralCipherKeys, userId, null, dataToEncode, function (err, token) {
            should.not.exist(err);
            should.exist(token);
        });
    });

    it('Should accept an array of firm keys', function () {
        const settingsWithSeveralFirmKeys = {
            cipherKey: 'myFirstCipherKey123',
            firmKeys:  ['myFirstFirmKey123', 'mySecondFirmKey123']
        };

        cipherToken.encode(settingsWithSeveralFirmKeys, userId, null, dataToEncode, function (err, token) {
            should.not.exist(err);
            should.exist(token);
        });
    });
});
