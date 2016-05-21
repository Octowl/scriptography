'use strict';

var base64 = require('./base64');
var utils = require('./utils');

var hash = {};

hash.simple = {};

hash.simple._pad = function (str, length) {
    var newString = str;
    str = str.split("").reverse().join("");
    while (newString.length < length) {
        newString += str
    }
    // for (var i = 0; i < length; i++) {
    //     console.log(i % str.length)
    //     newString += str[i % str.length]
    // }
    // newString = newString.slice(0,length)
    return newString
};

hash.simple._partition = function (str, length) {
    var result = []
    str = str.split("")
    while (str.length) {
        result.push(str.splice(0, length).join(""))
    }
    return result
};

hash.simple._combine = function (str1, str2) {
    str1 = base64.toDigits(str1);
    str2 = base64.toDigits(str2);
    str1 = str1.map(function (char, index) {
        return char ^ str2[index]
    })
    return base64.fromDigits(str1)
};

hash.simple.run = function (str, length) {
    str = utils.asciiToBase64(str)
    var padLength = length * 2
    var paddedString = hash.simple._pad(str, padLength)
    var partitionedString = hash.simple._partition(paddedString, length)
    var newHash = partitionedString.slice(1).reduce(function (previousPartition, currentPartition) {
        return hash.simple._combine(previousPartition, currentPartition)
    }, partitionedString[0])
    return newHash
};

hash.hmac = function () {

    var args = [].slice.call(arguments);

    var hashFn = args.length === 4 ? args.shift() : hash.simple.run;
    var secret = args[0];
    var str = args[1];
    var length = args[2];

    return hashFn(secret + str, length)

};

hash.pbdkf2 = function () {
    var args = [].slice.call(arguments);

    var hashFn = args.length === 5 ? args.shift() : hash.simple.run;
    var str = args[0];
    var salt = args[1];
    var runs = args[2];
    var length = args[3];

    for (var i = 0; i < runs; i++) {
        str = hash.hmac(hashFn, salt, str, length);
    }

    return str;
};

module.exports = hash;
