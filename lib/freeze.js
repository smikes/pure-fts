'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');

var fts = require('./fts');
var makeIndex = require('./makeIndex');

var version = {
    file: "4.0.0"
};

var keyConfig = {
    getName: function (x) { return x; },
    prefix: "/data/key",
    blockSize: 4096
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
