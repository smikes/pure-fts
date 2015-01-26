'use strict';

function percentLimit(value, percent) {
    return Math.max(10, Math.ceil(percent * value));
}

function prepFts(p) {
    var newFts = {},
        limit,
        ftsKeys;

    // first remove that are too frequent hits
    limit = percentLimit(p.keys.length, 0.20);

    ftsKeys = Object.keys(p.fts).filter(function (term) {
        return p.fts[term].hits.length <= limit;
    }).filter(function (key) { return key; });

    ftsKeys.forEach(function (term) {
        newFts[term] = p.fts[term];
    });

    return newFts;
}

module.exports = prepFts;

