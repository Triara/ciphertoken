'use strict';

const should = require('chai').should(),
    cipherToken = require('../lib/index.js');


const USER_ID = 'John Spartan';
const DATA = {field1:'a1b2c3d4e5f6'};

const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};


describe('Token creation', function () {
    it('Should generate tokens', function(done) {
        cipherToken.encode(settings, USER_ID, null, DATA, function (err, token) {
            should.not.exist(err);
            should.exist(token);
            done();
        });
    });

    it('Should not contain +, / and = symbols', function (done) {
        cipherToken.encode(settings, USER_ID, null, DATA, function (err, token) {
            token.should.not.contain('+');
            token.should.not.contain('/');
            token.should.not.contain('=');
            done();
        });
    });


    it('Should return an error when trying to create a token with empty settings', function (done) {
        cipherToken.encode({}, USER_ID, null, DATA, function (err) {
            should.exist(err);
            err.err.should.deep.equal('Settings required');
            done();
        });
    });

    it('Should return an error when trying to create a token with undefined settings', function (done) {
        cipherToken.encode(undefined, USER_ID, null, DATA, function (err) {
            should.exist(err);
            err.err.should.deep.equal('Settings required');
            done();
        });
    });

    it('Should return an error when cipherKey is missing', function (done) {
        cipherToken.encode({'firmKey': 'firmKey1234'}, USER_ID, null, DATA, function (err) {
            should.exist(err);
            err.err.should.deep.equal('CipherKey required');
            done();
        });
    });

    it('Should return an error when firmKey is missing', function (done) {
        cipherToken.encode({'cipherKey': 'cipherKey1234'}, USER_ID, null, DATA, function (err) {
            should.exist(err);
            err.err.should.deep.equal('FirmKey required');
            done();
        });
    });
});
