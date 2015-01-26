'use strict';

var fs = require('fs');
var Zip = require('adm-zip');
var util = require('util');
var JSONStream = require('JSONStream');
var async = require('async');

var Purefts = require('./pure-fts');

function thaw_4_0_0(file, cb) {
    var p = new Purefts();

    p.getFile = function (filename, cb) {
        fs.readFile(file + filename, function (err, buf) {
            cb(err, JSON.parse(buf));
        });
    };

    delete p.keys;

    p.keyConfig = {
        prefix: '/data/key',
        getFile: p.getFile,
        getName: function (x) { return x; }
    };
    p.valConfig = {
        prefix: '/data/val',
        getFile: p.getFile,
        getName: function (x) { return x.name; }
    };

    p.ftsConfig = {
        prefix: '/data/fts',
        getFile: p.getFile,
        getName: function (x) { return x.name; }
    };
    p.fts = {};

    async.parallel([
        function (callback) {
            p.getFile(p.keyConfig.prefix + '_index.json', function (err, data) {
                p.keyConfig.index = data;
                callback(err);
            });
        },
        function (callback) {
            p.getFile(p.valConfig.prefix + '_index.json', function (err, data) {
                p.valConfig.index = data;
                callback(err);
            });
        },
        function (callback) {
            p.getFile(p.ftsConfig.prefix + '_index.json', function (err, data) {
                p.ftsConfig.index = data;
                callback(err);
            });
        }
    ], function (err) {
        cb(err || null, p);
    });
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
