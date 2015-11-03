[![Circle CI](https://circleci.com/gh/strajah/strajah-token.svg?style=svg)](https://circleci.com/gh/strajah/strajah-token)

strajah-token
===========

A method to create ciphered accessToken based on the following principles:
* must include id information.
* must include expiration information.
* must be a designed token to transport, but not to store it.

## NodeJS


### Require

```js
const strajahToken = require('strajah-token');
```

### Usage

strajah-token is designed to be used as a module.


Initiate the token generator for a set of settings

```js
const accessTokenCreator = strajahToken(settings);
```


Tokens are created this way

```js
const cipheredToken = accessTokenCreator.create.userId('my-id12').data({'some': 'data'}).encode();
```


and can be decoded back to a more readable state with


```js
const decodedToken = accessTokenCreator.decode(cipheredToken);
```


#### Settings

Settings is a hash with the following properties

- __cipherKey__ : (required) used to cipher the accessToken
- __firmKey__ : (required) used to firm the accessToken
- __tokenExpirationMinutes__ : minutes of accessToken life (__90__ minutes by default)
- __cipherAlgorithm__ : algorithm used to cipher the token (__aes-256-cbc__ by default)
- __hmacAlgorithm__ : algorithm used to build the hmac (__md5__ by default)
- __hmacDigestEncoding__ : encoding used in the outbound of the hmac digest (__hex__ by default)
- __plainEncoding__ : encoding used in the data content in the token (__utf8__ by default)
- __tokenEncoding__ : encoding used in the token format (__base64__ by default)
- __enableSessionId__ : sessionId of an accessToken, can be preset at accessToken creation

Settings must be passed to strajah-token in each call. Only cipherKey and firmKey are required.



### Create tokens


First thing you need is a strajah-token for your settings

```js
const accessTokenCreator = strajahToken(settings);
```

After that you'll create a set for a given user which will contain data to be encoded in the token

```js
const cipheredToken = accessTokenCreator.set.userId('my-id12').data({'some': 'data'}).sessionId('my-previous-session-id').encode();
```

UserId can be an username or any other thing you use to identify your customers.
SessionId is only to be submitted when you want to create a token associated to the same session of another token (usually near expiration).
If you have __enableSessionId__ in your settings enabled but that's the first time creating a token for a new session, then you don't need to use the method 'sessionId' and a random UUID v4 will be generated.
Data is to encode the payload you want to travel with the token.

The result, cipheredToken, is an object which for now has only two properties
- token: contains the token itself
- error: only when there was an error during encoding process



### Decode tokens

You'll need an accessTokenCreator (still looking for a better name) initialized with the same settings as the ones used in the encoding process

```js
const decodedToken = accessTokenCreator.decode(validToken.token);
```

decodedToken has the following properties
- set: the data encoded within the token, contains: userId, expiresAtTimestamp, data and sessionId if enabled
- error: if an error occurred during decoding

The only one added by strajah-token is __expiresAtTimestamp__: at creation, gets the actual time and add to it the time expiration to calculate when will the token expire.
strajah-token doesn't care if the token has expired or not.


### Example

```js
const settings = {
    cipherKey: 'myCipherKey123',
    firmKey:  'myFirmKey123'
};

const strajahToken = require('strajah-token')(settings);

const cipheredToken = strajahToken.create.userId('John Spartan').data('validData').encode();
const decodedToken = strajahToken.decode(cipheredToken);

console.log(decodedToken.set.userId)
console.log(decodedToken.set.expiresAtTimestamp)
console.log(decodedToken.set.data)
console.log(decodedToken.set.sessionId)

```
