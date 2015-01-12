'use strict';

var thaw = require('./thaw');
var util = require('util');

var findDispatch = {
    "2.0.0": find_2_0_0
};

function find(skel) {
    if (!skel || !skel.name) {
        throw new Error(util.format('Cannot find object from skeleton %j: no name', skel));
    }

    if (!this.version) {
        return find_1_0_0(skel);
    }

    return findDispatch[this.version](this, skel);
}

function find_1_0_0(db, skel) {
    return db.values[skel.name];
}

function find_2_0_0(db, skel) {
    // exact name match only
    var key = skel.name.substring(0,3);
    
    if (!db.values[key]) {
        // try thawing
        db.values.key = thaw.thaw_key(db, key) || {};
    }
    
    return db.values[key][skel.name];
}

module.exports = find;
