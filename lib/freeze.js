'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');

var fts = require('./fts');
var makeIndex = require('./makeIndex');
var indexConfig = require('./indexConfig');

var version = {
    file: "4.0.0"
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

        makeIndex(indexConfig.key, p.keys, p.putFile);

        makeIndex(indexConfig.val, p.values, p.putFile);

        makeIndex(indexConfig.fts, fts(p), p.putFile);

        cb(null);
    });
}

module.exports = freeze;
