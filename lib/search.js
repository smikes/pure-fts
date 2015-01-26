'use strict';

var async = require('async');
var findIndex = require('./findIndex');

var Hoek = require('Hoek');
var stream = require('readable-stream');

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
    var p = this,
        keys;

    findIndex(p.ftsConfig, term, function (err, fts) {

        var s = new stream.Transform({objectMode: true});
        s._transform = function (chunk, encoding, callback) {
            if (match(term, chunk)) {
                cb(err, chunk);
            }

            callback(null);
        };
        s.on('data', cb);
        s.on('end', done);

        if (fts) {
            keys = Hoek.unique(fts.hits);

            async.each(keys, function (k, cont) {
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
        async.eachLimit(p.valConfig.index, 4, function (k, cont) {
            findIndex(p.valConfig, k.first, function (err, value, bag) {
                bag.forEach(function (val) {
                    s.write(val);
                });

                cont(err);
            });
        }, function (err) {
            s.end();
        });

    });
}
module.exports = search;
