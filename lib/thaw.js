'use strict';

var fs = require('fs');
var Zip = require('adm-zip');
var util = require('util');
var JSONStream = require('JSONStream');

var Purefts = require('./pure-fts');

var loadIndexes = require('./loadIndexes');

function makeDirGetFile(file) {
    return function (filename, cb) {
        fs.readFile(file + filename, function (err, buf) {
            if (err) {
                return cb(err);
            }

            try {
                cb(null, JSON.parse(buf));
            } catch (er) {
                cb(er);
            }
        });
    };
}

function makeZipGetFile(zip) {
    return function (name, cb) {
        try {
            zip.readAsTextAsync(name.substring(1), function (data) {
                cb(null, JSON.parse(data));
            });
        } catch (err) {
            return cb(new Error(err));
        }
    };
}

function thaw_4_0_0(getFile, cb) {
    var p = new Purefts();

    delete p.keys;
    p.fts = {};

    /* give p an appropriate async file getter */
    p.getFile = getFile;

    loadIndexes(p, cb);
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

function thawZip(file, cb) {
    var thawer,
        getFile,
        zip;

    try {
        zip = new Zip(file);

        getFile = makeZipGetFile(zip);

        getFile('/data/version.json', function (err, version) {
            if (err) {
                return cb(err);
            }

            thawer = chooseThawer(version.file);

            thawer(getFile, cb);
        });

    } catch (err) {
        return cb(new Error(err));
    }
}


function thaw(file, cb) {
    var getFile,
        thawer;

    function onError() {
        return thawZip(file, cb);
    }

    getFile = makeDirGetFile(file);

    getFile('/data/version.json', function (err, version) {
        if (err) {
            return onError();
        }

        thawer = chooseThawer(version.file);

        thawer(getFile, cb);
    });
}

module.exports = thaw;

/* export for testing */
thaw.chooseThawer = chooseThawer;
