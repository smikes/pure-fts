'use strict';

var stopWords = {
    'constructor': true,
    'toString': true,
    'hasOwnProperty': true,
    '__proto__': true,
    'valueOf': true,
    'npm': true
};

function stopwords(word) {
    if (word.length <= 3) { return false; }

    return stopWords[word];
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
