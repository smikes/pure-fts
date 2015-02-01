'use strict';

function Purefts() {
    var p = this;
    if (!(p instanceof Purefts)) {
        return new Purefts(arguments);
    }

    p.add = require('./add');
    p.clean = require('./clean');

    p.get = require('./get');
    p.search = require('./search');

    p.findRange = require('./findRange');

    p.freeze = require('./freeze');

    p.keys = [];
    p.values = {};
    p.fts = {};
}

module.exports = Purefts;

Purefts.thaw = require('./thaw');
