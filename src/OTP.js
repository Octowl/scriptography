'use strict';
var random = require('./random');
var utils = require('./utils');
var ascii = require('./ascii');
var base64 = require('./base64')

var OTP = {};

OTP.generateKey = function (length) {
    return random.base64(length)
};

OTP.encrypt = function (key, str) {
    str = utils.asciiToBase64(str);
    key = key.slice(0,str.length)
    var strDigits = base64.toDigits(str)
    var keyDigits = base64.toDigits(key)
    var cipherDigits = strDigits.map(function(digit, index) {
        return digit ^ keyDigits[index]
    })
    var cipher = base64.fromDigits(cipherDigits)
    return cipher
};

OTP.decrypt = function (key, str) {
    str = utils.base64ToAscii(str)
    var newString = OTP.encrypt(key, str)
    return utils.base64ToAscii(newString)
};

module.exports = OTP;
