'use strict';

var bsearch = require('binary-search');
var findIndex = require('./findIndex');

var getKey = {};

function getAllIndexedKeys(p) {
    return p.keyConfig.index.map(function (bag) {
        return p.getFile(bag.name);
    }).reduce(function (a, b) {
        return a.concat(b);
    });
}

module.exports = getKey;

getKey.getAllKeys = getAllIndexedKeys;
