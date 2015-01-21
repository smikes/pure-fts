'use strict';

var async = require('async');


function search(term, cb, done) {
    var purefts = this;

    purefts.clean();

    async.eachLimit(purefts.keys, 20, function (k, cont) {
        purefts.get(k, function (err, val) {
            if (val.name === term ||
                    (val.fts.indexOf(term) !== -1)) {
                cb(null, val);
            }
            return cont(err);
        });
    }, function () { done(); });
}
module.exports = search;
