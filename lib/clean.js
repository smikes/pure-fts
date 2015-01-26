'use strict';

function clean() {
    var purefts = this;

    purefts.keys = purefts.keys.sort();

    return;
}

module.exports = clean;
