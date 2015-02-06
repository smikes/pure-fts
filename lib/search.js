'use strict';

var async = require('async');
var findIndex = require('./findIndex');

var Hoek = require('hoek');
var through = require('through');

function makeMatcher(term) {
    return function (val) {
        if (val.name === term) {
            return true;
        }

        if (val.fts.indexOf(term) >= 0) {
            return true;
        }

        return false;
    };
}


function search(term, cb, done) {
    var p = this,
        match = makeMatcher(term),
        keys;

    findIndex(p.ftsConfig, term, function (err, fts) {

        var s = through(function (chunk) {
            if (match(chunk)) {
                cb(err, chunk);
            }
        }, done);

        if (fts) {
            keys = Hoek.unique(fts.hits);

            // if we group keys into bags
            // can avoid re-reading a bag multiple times

            async.eachLimit(keys, 8, function (k, cont) {
                p.get(k, function (err, val) {
                    s.write(val);
                    cont(err);
                });
            }, function () {
                s.end();
            });
            return;
        }

        // each value
        async.eachLimit(p.valConfig.index, 8, function (k, cont) {
            findIndex(p.valConfig, k.first, function (err, value, bag) {
                /*jslint unparam: true*/
                bag.forEach(function (val) {
                    s.write(val);
                });

                cont(err);
            });
        }, function () {
            s.end();
        });

    });
}

module.exports = search;
search.makeMatcher = makeMatcher;
