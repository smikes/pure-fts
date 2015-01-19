'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Zip = require('adm-zip');

var version = {
    file: "3.0.0"
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
        p.putFile("/data/keys.json", p.keys);
        p.putFile("/data/values.json", p.values);

        cb(null);
    });
}

module.exports = freeze;
