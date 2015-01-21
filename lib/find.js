'use strict';

function find(skel, cb, done) {
    if (!skel || !skel.name) {
        setImmediate(function () {
            setImmediate(done);
            return cb(new Error('Cannot find object from skeleton %j: no name', skel));
        });
        return;
    }

    // exact name match only
    this.get(skel.name, function (err, val) {
        if (err) {
            setImmediate(done);
            return cb(err);
        }

        cb(null, val);
        setImmediate(done);
    });
}

module.exports = find;
