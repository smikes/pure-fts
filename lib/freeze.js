'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');
var async = require('async');

var fts = require('./fts');
var makeIndex = require('./makeIndex');
var indexConfig = require('./indexConfig');

var version = {
    file: "4.0.0"
};

function freeze(file, cb) {
    var p = this;
    p.clean();

    p.putFile = function (filename, value, cb) {
        fs.writeFile(file + filename, JSON.stringify(value), cb);
    };

    rimraf(file, function () {

        mkdirp.sync(file + "/data/");

        var tasks = [
            function (callback) {
                p.putFile("/data/version.json", version, callback);
            },
            function (callback) {
                makeIndex(indexConfig.key, p.keys, p.putFile, callback);
            },
            function (callback) {
                makeIndex(indexConfig.val, p.values, p.putFile, callback);
            },
            function (callback) {
                makeIndex(indexConfig.fts, fts(p), p.putFile, callback);
            }
        ];

        async.series(tasks, cb);
    });
}

module.exports = freeze;
