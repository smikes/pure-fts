'use strict';

var fs = require('fs');
var Zip = require('adm-zip');
var util = require('util');
var async = require('async');
var JSONStream = require('JSONStream');

var Purefts = require('./pure-fts');

var loadIndexes = require('./loadIndexes');

// supported data versions : only one right now
function thaw_4_0_0(getFile, cb) {
    var p = new Purefts();

    delete p.keys;
    p.fts = {};

    /* give p an appropriate async file getter */
    p.getFile = getFile;

    loadIndexes(p, cb);
}

function invalidVersion(version) {
    return function (z, cb) {
        /*jslint unparam:true*/
        return cb(new Error(util.format("unknown version %j", version)));
    };
}

var versions = {
    "4.0.0": thaw_4_0_0
};

function chooseVersion(version) {
    var thawer = versions[version];
    if (!thawer) {
        thawer = invalidVersion(version);
    }
    return thawer;
}

// convert thrown exceptions into callback err
function parseJSON(buf, cb) {
    try {
        cb(null, JSON.parse(buf));
    } catch (err) {
        return cb(err);
    }
}

// supported storage formats: orthogonal to version
function makeDirGetFile(file) {
    return function (filename, cb) {
        fs.readFile(file + filename, function (err, buf) {
            if (err) {
                return cb(err);
            }

            parseJSON(buf, cb);
        });
    };
}

function makeZipGetFile(file) {
    var zip = new Zip(file);

    return function (name, cb) {
        zip.readAsTextAsync(name.substring(1), function (data, err) {
            if (err) {
                return cb(err);
            }

            parseJSON(data, cb);
        });
    };
}

function makeThawFormatReader(makeGetFile) {
    return function (file, cb) {
        var getFile,
            thawer;

        try {
            getFile = makeGetFile(file);

            getFile('/data/version.json', function (err, version) {
                if (err) {
                    return cb(err);
                }

                thawer = chooseVersion(version.file);

                thawer(getFile, cb);
            });
        } catch (err) {
            return cb(err);
        }
    };
}

var thawFormats = [
    makeThawFormatReader(makeDirGetFile),
    makeThawFormatReader(makeZipGetFile)
];



function thaw(file, cb) {
    var errs = [];

    // try each known format
    async.each(thawFormats, function (t, next) {
        t(file, function (err, p) {

            // if failed, store error 
            if (err) {
                errs.push(String(err));

                // and continue to next format
                return next(null);
            }

            // thawed it, so terminate the async each
            next(true);

            cb(null, p);
        });
    }, function (found) {
        if (found) {
            return;
        }

        // report all errors from each attempted format
        if (errs) {
            cb(new Error("Could not thaw " + file + ": unknown format\n ",
                         errs.join("\n ")));
        }
    });
}

module.exports = thaw;

/* export for testing */
thaw.chooseThawer = chooseVersion;
thaw.parseJSON = parseJSON;
