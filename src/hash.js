'use strict';

var base64 = require('./base64');
var utils = require('./utils');

var hash = {};

hash.simple = {};

hash.simple._pad = function (str, length) {
    var newString;
    for (var i = 0; i < length; i++) {
        newString += str[i % str.length]
    }
    return newString
};

hash.simple._partition = function () {};

hash.simple._combine = function () {};

hash.simple.run = function () {};

hash.hmac = function () {};

hash.pbdkf2 = function () {};

module.exports = hash;
