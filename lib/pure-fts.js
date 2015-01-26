'use strict';

function Purefts() {
    var p = this;
    if (!(this instanceof Purefts)) {
        return new Purefts(arguments);
    }

    this.add = require('./add');
    this.clean = require('./clean');

    this.getKey = require('./get_key');
    this.get = require('./get');
    this.find = require('./find');
    this.search = require('./search');

    // not ALL keys!
    this.getAllKeys = function () {
        if (p.keys) {
            return p.keys;
        }

        return p.getKey.getAllKeys(p);
    };

    this.freeze = require('./freeze');

    this.keys = [];
    this.values = {};
    this.fts = {};
}

module.exports = Purefts;

Purefts.thaw = require('./thaw');
