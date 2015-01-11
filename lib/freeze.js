'use strict';

var fs = require('fs');
var Zip = require('adm-zip');

var version = {
    file: "1.0.0"
};

function onBuffer(file, cb) {
    return function (buf) {
        if (buf instanceof Error) {
            return cb(buf);
        }

        fs.writeFile(file, buf, cb);
    };
}

function freeze(file, cb) {
    this.clean();

    var z = new Zip();

    z.addFile("data/", new Buffer(""));
    z.addFile("data/version.json", new Buffer(JSON.stringify(version)));
    z.addFile("data/keys.json", new Buffer(JSON.stringify(this.keys)));
    z.addFile("data/values.json", new Buffer(JSON.stringify(this.values)));

    cb = onBuffer(file, cb);
    return z.toBuffer(cb, cb);
}

module.exports = freeze;

/* export for testing */
freeze.onBuffer = onBuffer;
