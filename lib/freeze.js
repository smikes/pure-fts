'use strict';

var fs = require('fs');
var Zip = require('adm-zip');

var version = {
    file: "2.0.0"
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
    var db = this;
    
    db.clean();


    var z = new Zip();

    z.addFile("data/", new Buffer(""));
    z.addFile("data/version.json", new Buffer(JSON.stringify(version)));
    z.addFile("data/keys.json", new Buffer(JSON.stringify(db.keys)));

    // segment values into separate files
    Object.keys(db.values).forEach(function (k) {
        var file = 'data/' + k + '.json';
        z.addFile(file, new Buffer(JSON.stringify(db.values[k])));
    });

    cb = onBuffer(file, cb);
    return z.toBuffer(cb, cb);
}

module.exports = freeze;

/* export for testing */
freeze.onBuffer = onBuffer;
