'use strict';

var async = require('async');


function search(term, cb, done) {
    var purefts = this;

    purefts.clean();

    async.each(purefts.keys, function (k, cont) {
        purefts.get(k, function (err, val) {
            if (err) {
                cb(err);
                cont();
            }

            if (val.name === term ||
                    (val.description.indexOf(term) !== -1)) {
                cb(null, val);
            }
            cont();
        });
    }, function () { done(); });
}

module.exports = search;
