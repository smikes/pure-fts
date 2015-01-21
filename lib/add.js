'use strict';

var stopWords = {
    'constructor': true,
    'toString': true,
    'hasOwnProperty': true,
    '__proto__': true,
    'valueOf': true,
    'npm': true
};

function is_stopword(word) {
    if (word.length <= 3) {
        return true;
    }

    return stopWords[word];
}

function is_not_stopword(word) {
    return !is_stopword(word);
}

function addfts(purefts, term, name) {
    if (is_stopword(term)) {
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

    obj.fts.split(' ').filter(is_not_stopword)
        .forEach(function (term) {
            addfts(purefts, term, obj.name);
        });
    addfts(purefts, obj.name, obj.name);

    purefts.values[obj.name] = obj;
}

module.exports = add;
