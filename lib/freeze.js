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

    rimraf(file, function () {

        mkdirp.sync(file + "/data/");
        fs.writeFileSync(file + "/data/version.json", JSON.stringify(version));
        fs.writeFileSync(file + "/data/keys.json", JSON.stringify(p.keys));
        fs.writeFileSync(file + "/data/values.json", JSON.stringify(p.values));

        cb(null);
    });
}

module.exports = freeze;
