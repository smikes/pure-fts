'use strict';

var util = require('util');

function get(name, cb) {
    var p = this;

    setImmediate(function () {
        if (!name) {
            return cb(new Error(util.format('Cannot find object with invalid name %j',
                                        name)));
        }

        var v = p.values[name];
        if (!v) {
            return cb(new Error(util.format('No object with name %j', name)));
        }

        cb(null, v);
    });
}

module.exports = get;
