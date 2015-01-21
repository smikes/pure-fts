'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');

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

function bagName(d) {
    return "/data/val" + zeroFill(d) + ".json";
}

function makeIndexEntry(bag, bagCount) {
    return {
        index: bagCount,
        name: bagName(bagCount),
        first: bag[0].name,
        last: bag[bag.length - 1].name
    };
}

function makeValueIndex(keys, values, putFile) {
    var i = 0,
        key,
        bag = [],
        index = [],
        bagCount = 0;

    for (i = 0; i < keys.length; i += 1) {

        key = keys[i];
        bag.push(values[key]);

        // every 1024 values
        if (bag.length === 1024) {

            // write values to bag
            putFile(bagName(bagCount), bag);

            // record beginning and end
            index.push(makeIndexEntry(bag, bagCount));

            bag = [];
            bagCount += 1;
        }

    }

    // last bag
    if (bag.length) {
        putFile(bagName(bagCount), bag);

        index.push(makeIndexEntry(bag, bagCount));
    }

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
        p.putFile("/data/keys.json", p.keys);

        // segment values into index
        var values_index = makeValueIndex(p.keys, p.values, p.putFile);
        p.putFile("/data/values_index.json", values_index);

        cb(null);
    });
}

module.exports = freeze;

