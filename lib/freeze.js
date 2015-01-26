'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');

var fts = require('./fts');

var version = {
    file: "4.0.0"
};

function zeroFill(d) {
    var s = d.toString(36);
    while (s.length < 4) {
        s = '0' + s;
    }
    return s;
}

var keyConfig = {
    getName: function (x) { return x; },
    prefix: "/data/key",
    blockSize: 1024
};

var ftsConfig = {
    getName: function (x) { return x.name; },
    prefix: "/data/fts",
    blockSize: 512
};

var valueConfig = {
    getName: function (x) { return x.name; },
    prefix: "/data/val",
    blockSize: 256
};

function makeIndex(config, object, putFile) {
    var i = 0,
        bag = [],
        index = [],
        keys,
        getValue,
        bagCount = 0;

    if (Array.isArray(object)) {
        keys = [].concat(object);
        keys.sort(config.compareNames);
        getValue = function (key) { return key; };
    } else {
        keys = Object.keys(object).sort(config.compareNames);
        getValue = function (key) { return object[key]; };
    }

    function makeIndexEntry(bag, bagCount) {
        return {
            index: bagCount,
            name: config.prefix + zeroFill(bagCount) + ".json",
            first: config.getName(bag[0]),
            last: config.getName(bag[bag.length - 1])
        };
    }

    function pushIndexEntry() {
        var indexEntry = makeIndexEntry(bag, bagCount);

        // write this bag
        putFile(indexEntry.name, bag);

        index.push(indexEntry);

        bag = [];
        bagCount += 1;
    }

    for (i = 0; i < keys.length; i += 1) {

        bag.push(getValue(keys[i]));

        if (bag.length === config.blockSize) {
            pushIndexEntry();
        }
    }

    // last bag
    if (bag.length) {
        pushIndexEntry();
    }

    putFile(config.prefix + "_index.json", index);
    return index;
}

function freeze(file, cb) {
    var p = this;
    p.clean();

    p.putFile = function (filename, value) {
        fs.writeFileSync(file + filename, JSON.stringify(value));
    };

    rimraf(file, function () {

        mkdirp.sync(file + "/data/");

        p.putFile("/data/version.json", version);

        makeIndex(keyConfig, p.keys, p.putFile);

        makeIndex(valueConfig, p.values, p.putFile);

        makeIndex(ftsConfig, fts(p), p.putFile);

        cb(null);
    });
}

module.exports = freeze;
