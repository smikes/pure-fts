'use strict';

var bsearch = require('binary-search');
var async = require('async');

function findBag(config, term) {
    return bsearch(config.index, term, function (a, b) {
        return a.last < b ? -1 : (a.first > b ? 1 : 0);
    });
}

function findRange(start, end, cb, done) {
    var p = this,
        config = p.keyConfig,
        start_bag_idx,
        end_bag_idx,
        i,
        bags = [];

    // find first bag
    start_bag_idx = findBag(config, start);

    if (start_bag_idx < 0) {
        start_bag_idx = 0;
    }

    // find ending bag
    end_bag_idx = findBag(config, end);

    if (end_bag_idx < 0) {
        end_bag_idx = config.index.length - 1;
    }

    for (i = start_bag_idx; i <= end_bag_idx; i += 1) {
        bags.push(i);
    }

    async.eachSeries(bags, function (bag_idx, callback) {
        var bag = config.index[bag_idx];

        config.getFile(bag.name, function (err, bagValues) {
            if (err) {
                return cb(err);
            }

            bagValues.filter(function (n) {
                return (start <= n && n <= end);
            }).forEach(function (n) {
                cb(null, n);
            });
            callback();
        });
    }, done);

    return;
}

module.exports = findRange;
