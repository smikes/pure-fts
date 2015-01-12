'use strict';

function Purefts() {
    if (!(this instanceof Purefts)) {
        return new Purefts(arguments);
    }

    this.add = require('./add');
    this.find = require('./find');

    this.clean = require('./clean');
    this.search = require('./search');

    this.freeze = require('./freeze');

    this.version = "2.0.0";

    this.keys = [];
    this.values = {};
}

module.exports = Purefts;

Purefts.thaw = require('./thaw');