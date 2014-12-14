'use strict';

function Purefts() {
    if (!(this instanceof Purefts)) {
        return new Purefts(arguments);
    }

    this.add = require('./add');
    this.find = require('./find');

    this.clean = require('./clean');
    this.search = require('./search');

    this.keys = [];
    this.values = {};
}

module.exports = Purefts;
