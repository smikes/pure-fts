'use strict';


function search(term) {
    var purefts = this;

    purefts.clean();

    return purefts.keys.filter(function (k) {
        var val = purefts.find({name: k});
        return val.name === term ||
            (val.description.indexOf(term) !== -1);
    });
}

module.exports = search;
