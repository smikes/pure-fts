'use strict';

function add(obj) {
    if (!obj || !obj.name) {
        throw new Error("Cannot add object %j: no `name` member", obj);
    }

    var purefts = this;

    purefts.keys.push(obj.name);
    purefts.isDirty = true;

    // add fts entries
    if (!obj.fts) {
        obj.fts = obj.description || "";
    }

    purefts.values[obj.name] = obj;
}

module.exports = add;
