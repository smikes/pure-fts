'use strict';

var indexConfig = require('./indexConfig');
var async = require('async');

function makeTask(p, n, indexConfig) {
    var cfg = indexConfig[n];

    cfg.getFile = p.getFile;
    p[n + 'Config'] = cfg;

    return function (callback) {
        var file = cfg.prefix + '_index.json';
        p.getFile(file, function (err, data) {
            cfg.index = data;
            callback(err);
        });
    };
}


function loadIndexes(p, cb) {
    var tasks = [];

    Object.keys(indexConfig).forEach(function (n) {
        var task = makeTask(p, n, indexConfig);

        tasks.push(task);
    });

    async.series(tasks, function () {
        cb(null, p);
    });
}


module.exports = loadIndexes;
