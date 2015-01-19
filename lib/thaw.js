'use strict';

var fs = require('fs');
var Zip = require('adm-zip');
var util = require('util');
var JSONStream = require('JSONStream');

var Purefts = require('./pure-fts');

function thaw_3_0_0(file, cb) {
    var p = new Purefts();

    p.keys = JSON.parse(fs.readFileSync(file + '/data/keys.json'));
    p.values = JSON.parse(fs.readFileSync(file + '/data/values.json'));

    cb(null, p);
}

var thawDispatch = {
    "3.0.0": thaw_3_0_0
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
