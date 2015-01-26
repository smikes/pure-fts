'use strict';

var async = require('async');
var findIndex = require('./findIndex');

function match(term, val) {
    if (val.name === term) {
        return true;
    }

    if (val.fts.indexOf(term) >= 0) {
        return true;
    }

    return false;
}


function search(term, cb, done) {
    var purefts = this,
        keys;

    return findIndex(purefts.ftsConfig, term, function (err, fts) {

        if (fts) {
            keys = fts.hits;
        } else {
            // TODO: get all values
            keys = purefts.getAllKeys();
        }

        async.eachLimit(keys, 20, function (k, cont) {
            purefts.get(k, function (err, val) {
                if (match(term, val)) {
                    cb(null, val);
                }
                return cont(err);
            });
        }, done);
    });
}
module.exports = search;
