'use strict';

var fs = require('fs');
var Zip = require('adm-zip');
var util = require('util');
var JSONStream = require('JSONStream');

var Purefts = require('./pure-fts');

function thaw_4_0_0(file, cb) {
    var p = new Purefts();

    p.getFile = function (filename) {
        return JSON.parse(fs.readFileSync(file + filename));
    };

    delete p.keys;
    p.keys_index = p.getFile('/data/key_index.json');

    p.values_index = p.getFile('/data/val_index.json');

    p.fts_index = p.getFile('/data/fts_index.json');
    p.fts = {};

    cb(null, p);
}

var thawDispatch = {
    "4.0.0": thaw_4_0_0
};

function invalidVersion(version) {
    return function (z, cb) {
        /*jslint unparam:true*/
        return cb(new Error(util.format("unknown version %j", version)));
    };
}

function chooseThawer(version) {
    var thawer = thawDispatch[version];
    if (!thawer) {
        thawer = invalidVersion(version);
    }
    return thawer;
}

function thaw(file, cb) {
    var version,
        thawer;

    // try reading as dir
    fs.createReadStream(file + '/data/version.json')
        .on('error', cb)
        .pipe(JSONStream.parse())
        .on('error', cb)
        .on('data', function (data) {
            version = data;
            thawer = chooseThawer(version.file);

            thawer(file, cb);
        });
}

module.exports = thaw;

/* export for testing */
thaw.chooseThawer = chooseThawer;
