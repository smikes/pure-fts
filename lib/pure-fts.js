'use strict';

function Purefts() {
    if (!(this instanceof Purefts)) {
        return new Purefts(arguments);
    }

    this.add = require('./add');
    this.clean = require('./clean');

    this.get = require('./get');
    this.find = require('./find');
    this.search = require('./search');

    this.freeze = require('./freeze');

    this.keys = [];
    this.values = {};
}

module.exports = Purefts;

Purefts.thaw = require('./thaw');
