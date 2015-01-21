'use strict';

var async = require('async');
var bsearch = require('binary-search');

function find_fts(p, name) {
    var fts_idx;

    if (!p.fts_index) {
        return;
    }

    fts_idx = bsearch(p.fts_index, name, function (a, b) {
        return a.last < b ? -1 : (a.first > b ? 1 : 0);
    });

    return fts_idx < 0 ? undefined : p.fts_index[fts_idx];
}




function search(term, cb, done) {
    var purefts = this,
        fts,
        keys;

    // load hits for term
    fts = find_fts(purefts, term);

    // fts index exists but not loaded
    if (fts && purefts.fts[fts.first]) {
        purefts.getFile(fts.name).forEach(function (v) {
            purefts.fts[v.name] = v;
        });
    }

    keys = purefts.fts[term] ? purefts.fts[term].hits : purefts.keys;

    async.eachLimit(keys, 20, function (k, cont) {
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
