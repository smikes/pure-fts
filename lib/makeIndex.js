'use strict';

function zeroFill(d) {
    var s = d.toString(36);
    while (s.length < 4) {
        s = '0' + s;
    }
    return s;
}

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

module.exports = makeIndex;
