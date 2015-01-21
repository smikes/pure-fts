'use strict';

function stopwords(word) {
    if (word.length <= 3) { return false; }
    if (word === 'constructor') { return false; }
    if (word === 'toString') { return false; }
    if (word === 'hasOwnProperty') { return false; }
    if (word === '__proto__') { return false; }
    if (word === 'valueOf') { return false; }
    if (word === 'npm') { return false; }

    return true;
}

function addfts(purefts, term, name) {
    if (!stopwords(term)) {
        return;
    }

    purefts.fts[term] = purefts.fts[term] || {
        name: term,
        hits: []
    };

    purefts.fts[term].hits.push(name);
}

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

    obj.fts.split(' ').filter(stopwords)
        .forEach(function (term) {
            addfts(purefts, term, obj.name);
        });
    addfts(purefts, obj.name, obj.name);

    purefts.values[obj.name] = obj;
}

module.exports = add;
