'use strict';

function identity(x) {
    return x;
}

function dotName(x) {
    return x.name;
}

var indexConfig = {
    key: {
        getName: identity,
        prefix: "/data/key",
        blockSize: 4096
    },
    fts: {
        getName: dotName,
        prefix: "/data/fts",
        blockSize: 512
    },
    val: {
        getName: dotName,
        prefix: "/data/val",
        blockSize: 64
    }
};

module.exports = indexConfig;
