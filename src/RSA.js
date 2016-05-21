'use strict';
var random = require('./random');
var utils = require('./utils');
var ascii = require('./ascii');
var base64 = require('./base64')

var utils = require('./utils');

var RSA = {};

RSA._selectKeyPair = function(primeA, primeB) {
    var n = primeA*primeB;
    var phiN = utils.totient(n, [11,17]);

    var e = random.integer(phiN);
    var d = (1/e) % phiN;

    return [e,d];
}

RSA.generateKeys = function (primeA, primeB) {
    var keyPair = RSA._selectKeyPair(primeA, primeB);
    var n = primeA*primeB;

    return {
        public: `${n}:${Math.min.apply(null, keyPair)}`,
        private: `${n}:${Math.max.apply(null, keyPair)}`
    }
};

RSA.encrypt = function (key, str) {
    key = key.split(':');
    var n = +key[0];
    key = +key[1];

    var strDigits = ascii.toDigits(str);

    var cipherDigits = strDigits.map(function(digit) {
        return utils.modularExponentiation(digit, key, n);
    })

    var cipher = ascii.fromDigits(cipherDigits)

    return utils.asciiToBase64(cipher);

};

RSA.decrypt = function (key, cipher) {
    key = key.split(':');
    var n = +key[0];
    key = +key[1];

    var cipherDigits = base64.toDigits(cipher);

    var strDigits = cipherDigits.map(function(digit) {
        return utils.modularExponentiation(digit, key, n);
    })

    var str = base64.fromDigits(strDigits)

    return utils.base64ToAscii(str);
};

module.exports = RSA;
