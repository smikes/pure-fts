'use strict';

function clean() {
    var purefts = this;

    console.error('cleaning');
    if (!purefts.isDirty) {
        return;
    }

    purefts.keys = purefts.keys.sort();
    purefts.isDirty = false;

    return;
}

module.exports = clean;
