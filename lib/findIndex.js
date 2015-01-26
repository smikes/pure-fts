'use strict';

var bsearch = require('binary-search');

function findIndex(config, name, cb) {
    var bag_idx,
        bag,
        idx;

    bag_idx = bsearch(config.index, name, function (a, b) {
        return a.last < b ? -1 : (a.first > b ? 1 : 0);
    });

    if (bag_idx < 0) {
        return cb(null);
    }

    bag = config.index[bag_idx];

    config.getFile(bag.name, function (err, bagValues) {

        idx = bsearch(bagValues, name, function (a, b) {
            var n = config.getName(a);
            return n < b ? -1 : n > b;
        });

        return cb(null, (idx < 0) ? undefined : bagValues[idx],
                  bagValues);

    });
}

module.exports = findIndex;
