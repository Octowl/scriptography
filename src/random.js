'use strict';

var base64 = require('./base64');

var random = {};

random.integer = function (min, max) {
    var args = [].slice.call(arguments);
    if (args.length < 2) {
        max = min;
        min = 0;
    }
    return Math.round(Math.random() * (max - min)) + min;
};

var charSet = base64._charSet;
random.base64 = function (length) {
    var randStr = [];

    for (var i = 0; i < length; i++) {
        randStr.push(random.integer(63));
    }

    return base64.fromDigits(randStr);
};

module.exports = random;
