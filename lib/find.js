'use strict';

function find(skel) {
    if (!skel || !skel.name) {
        throw new Error('Cannot find object from skeleton %j: no name');
    }

    // exact name match only
    return this.values[skel.name];
}

module.exports = find;
