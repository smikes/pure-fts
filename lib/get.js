'use strict';

var util = require('util');
var bsearch = require('binary-search');

function find_bag(p, name) {
    var idx,
        bag_idx;

    idx = bsearch(p.keys, name, function (a, b) {
        return a < b ? -1 : a > b;
    });
    if (idx < 0) {
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
        if (!v) {

            // find bag
            var bag = find_bag(p, name);

            if (!bag) {
                return cb(new Error(util.format('No object with name %j', name)));
            }

            // load bag
            p.getFile(bag.name).forEach(function (v) {
                p.values[v.name] = v;
            });

            v = p.values[name];
        }

        cb(null, v);
    });
}

module.exports = get;
