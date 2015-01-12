'use strict';

function add(obj) {
    if (!obj || !obj.name) {
        throw new Error("Cannot add object %j: no `name` member", obj);
    }

    var purefts = this,
        key = purefts.key(obj.name);

    purefts.keys.push(obj.name);
    purefts.isDirty = true;

    purefts.values[key] = purefts.values[key] || {};
    purefts.values[key][obj.name] = obj;

    // add fts entries
}

module.exports = add;
