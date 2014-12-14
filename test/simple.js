'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

describe('create objects', function () {
    it('creates an object with new', function (done) {
        var p = new Purefts();

        expect(p).to.be.instanceof(Purefts);
        done();
    });

    it('creates an object without new', function (done) {
        var p = Purefts();

        expect(p).to.be.instanceof(Purefts);
        done();
    });
});
