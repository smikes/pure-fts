'use strict';

var util = require('util');
var bsearch = require('binary-search');

var findIndex = require('./findIndex');

function find_bag(p, name) {
    var bag_idx,
        n;

    n = p.getKey(name);
    if (!n) {
        return;
    }

    bag_idx = bsearch(p.values_index, name, function (a, b) {
        return a.last < b ? -1 : (a.first > b ? 1 : 0);
    });

    return p.values_index[bag_idx];
}

function get(name, cb) {
    var p = this,
        v;

    setImmediate(function () {
        if (!name) {
            return cb(new Error(util.format('Cannot find object with invalid name %j',
                                        name)));
        }

        v = p.values[name];
        if (v) {
            return cb(null, v);
        }

        findIndex(p.valConfig, name, function (err, value, bag) {

            if (bag) {
                bag.forEach(function (k) {
                    p.values[k.name] = k;
                });
            }

            if (!value) {
                err = new Error(util.format('No object with name %j', name));
            }

            return cb(err, value);
        });

    });
}

module.exports = get;
