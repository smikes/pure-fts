'use strict';

function Purefts() {
    if (!(this instanceof Purefts)) {
        return new Purefts(arguments);
    }
}

module.exports = Purefts;
