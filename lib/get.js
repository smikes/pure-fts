'use strict';

var util = require('util');
var bsearch = require('binary-search');

var findIndex = require('./findIndex');

function get(name, cb) {
    var p = this,
        v;

    setImmediate(function () {
        if (!name) {
            return cb(new Error(util.format('Cannot find object with invalid name %j',
                                        name)));
        }

        v = p.values[name];
        if (v) {
            return cb(null, v);
        }

        findIndex(p.valConfig, name, function (err, value, bag) {

            p.values[name] = value;

            if (!value) {
                err = new Error(util.format('No object with name %j', name));
            }

            return cb(err, value);
        });

    });
}

module.exports = get;
