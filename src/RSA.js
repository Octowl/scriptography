'use strict';
var random = require('./random');
var utils = require('./utils');
var ascii = require('./ascii');
var base64 = require('./base64')

var utils = require('./utils');

var RSA = {};

RSA._selectKeyPair = function(primeA, primeB) {
    var n = primeA*primeB;
    var phiN = utils.totient(n, [primeA,primeB]);

    var e = 2; //random.integer(phiN);

    while(utils.gcd(e,phiN) !== 1) {
        e++;
    }

    //var d = (1/e) % phiN;

    var d = null;
    for (var k = 1; !Number.isInteger(d); k++) {
        d = (phiN * k + 1)/e
    }

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
    var modulus = Number(key[0]);
    var exponent = Number(key[1]);

    var strDigits = ascii.toDigits(str);

    var cipherDigits = strDigits.map(function(digit) {
        return utils.modularExponentiation(digit, exponent, modulus);
    })

    var cipher = ascii.fromDigits(cipherDigits)

    return utils.asciiToBase64(cipher);

};

RSA.decrypt = function (key, cipher) {
    key = key.split(':');
    var modulus = Number(key[0]);
    var exponent = Number(key[1]);

    var asciiCipher = utils.base64ToAscii(cipher);

    var plainDigits =  ascii.toDigits(asciiCipher).map(function(digit) {
        return utils.modularExponentiation(digit, exponent, modulus);
    });

    return ascii.fromDigits(plainDigits);
};

module.exports = RSA;
