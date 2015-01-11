'use strict';

var Zip = require('adm-zip');
var util = require('util');

var Purefts = require('./pure-fts');

function thaw_1_0_0(z, cb) {
    var p = new Purefts();

    p.keys = JSON.parse(z.readFile('data/keys.json'));
    p.values = JSON.parse(z.readFile('data/values.json'));

    cb(null, p);
}

var thawDispatch = {
    "1.0.0": thaw_1_0_0
};

function invalidVersion(version) {
    return function (z, cb) {
        return cb(new Error(util.format("unknown version %j", version)));
    };
}

function chooseThawer(version, cb) {
    var thawer = thawDispatch[version];
    if(!thawer) {
        thawer = invalidVersion(version);
    }
    return thawer;
}

function thaw(file, cb) {
    var z = new Zip(file),
        version = JSON.parse(z.readFile('data/version.json')),
        thawer = chooseThawer(version.file);
            
    thawer(z, cb);
}

module.exports = thaw;

/* export for testing */
thaw.chooseThawer = chooseThawer;
