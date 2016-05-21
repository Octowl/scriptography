'use strict';
var random = require('./random');
var utils = require('./utils');
var ascii = require('./ascii');
var base64 = require('./base64')

var CSC = {};

CSC.generateKey = function () {
    return random.integer(1, 4095)
};

CSC.encrypt = function (key, str) {
    str = ascii.toDigits(str)
    str = str.map(function(char) {
        return char + key
    })
    str = ascii.fromDigits(str)
    str = utils.asciiToBase64(str)
    return str
};

CSC.decrypt = function (key, str) {
    str = utils.base64ToAscii(str)
    str = ascii.toDigits(str)
    str = str.map(function(char) {
        return char - key
    })
    str = ascii.fromDigits(str)
    return str
};

module.exports = CSC;
