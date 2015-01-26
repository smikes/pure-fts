'use strict';
var bsearch = require('binary-search');

function getKey(name) {
    var p = this,
        key_idx,
        bag,
        idx;

    if (p.keys) {

        idx = bsearch(p.keys, name, function (a, b) {
            return a < b ? -1 : a > b;
        });

    } else {

        key_idx = bsearch(p.keys_index, name, function (a, b) {
            return a.last < b ? -1 : (a.first > b ? 1 : 0);
        });

        if (key_idx < 0) {
            return undefined;
        }

        bag = p.keys_index[key_idx];
        idx = bsearch(p.getFile(bag.name), name, function (a, b) {
            return a < b ? -1 : a > b;
        });
    }

    return (idx < 0) ? undefined : name;
}

function getAllKeys(p) {
    return p.keys_index.map(function (bag) {
        return p.getFile(bag.name);
    }).reduce(function (a, b) {
        return a.concat(b);
    });
}

module.exports = getKey;

getKey.getAllKeys = getAllKeys;
