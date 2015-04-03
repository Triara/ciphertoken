'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');

const USER_ID = 'John Spartan';
const DATA = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


let validToken;
cipherToken.encode(settings, USER_ID, null, DATA, function (err, token) {
    validToken = token;
});


describe('Decode tokens', function () {
    it('Generated token must be decoded back to get original data', function (done) {
        cipherToken.decode(settings, validToken, function (err, tokenSet) {
            should.not.exist(err);
            should.exist(tokenSet);
            tokenSet.userId.should.deep.equal(USER_ID);
            tokenSet.data.should.deep.equal(DATA);
            done();
        });
    });

    it('Should return an expiresAtTimestamp', function (done) {
        cipherToken.decode(settings, validToken, function (err, tokenSet) {
            should.exist(tokenSet.expiresAtTimestamp);
            done();
        });
    });


    it('ExpiresInTimestamp should be greater than actual time according to settings', function (done) {
        const customSettings = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey',
            tokenExpirationMinutes : 2
        };
        cipherToken.encode(customSettings, USER_ID, null, DATA, function (err, token) {
            cipherToken.decode(customSettings, token, function (err, tokenSet) {
                const expected = new Date().getTime() + customSettings.tokenExpirationMinutes*60*1000,
                    expectedRounded = (expected/(60*1000)).toFixed(),
                    actualRounded = (tokenSet.expiresAtTimestamp/(60*1000)).toFixed();

                expectedRounded.should.equal(actualRounded);
                done();
            });
        });
    });

    it('Should return an error when submitted token is invalid', function (done) {
        const token = 'invalid token';
        cipherToken.decode(settings, token, function (err, tokenSet) {
            should.exist(err);
            should.not.exist(tokenSet);
            err.err.should.be.deep.equal('Bad token');
            done();
        });
    });

    it('Should return an error when trying to decode with invalid firm key', function (done) {
        const settingsWithDifferentFirmKey = {
            cipherKey: 'myCipherKey123',
            firmKey: 'anotherFirmKey'
        };

        cipherToken.decode(settingsWithDifferentFirmKey, validToken, function (err, tokenSet) {
            should.not.exist(tokenSet);
            should.exist(err);
            err.err.should.be.deep.equal('Bad credentials');
            done();
        });
    });

    it('Should return an error when trying to decode with incorrect settings', function (done) {
        const settingsWithDifferentCipherKey = {
            cipherKey: 'anotherCipherKey123',
            firmKey:  'myFirmKey123'
        };

        cipherToken.decode(settingsWithDifferentCipherKey, validToken, function (err, tokenSet) {
            should.not.exist(tokenSet);
            should.exist(err);
            err.err.should.be.deep.equal('Bad credentials');
            done();
        });
    });
});
