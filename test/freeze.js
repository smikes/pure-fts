'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
var fs = require('fs');
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

describe('can freeze', function () {
    it('can freeze an object to a file', function (done) {
        var p = new Purefts(),
            item = {name: 'foo', description: 'a foo thing'};

        p.add(item);

        p.freeze('./foo', function (err) {
            expect(err).to.equal(null);

            Purefts.thaw("./foo", function (err, q) {
                expect(err).to.equal(null);
                expect(q).to.be.instanceof(Purefts);
                done();
            });
        });
    });

    it('handles failed callbacks', function (done) {
        var p = new Purefts(),
            cb = p.freeze.onBuffer('foo', function (err) {
                expect(err).to.be.instanceof(Error);
                done();
            });

        cb(new Error('bad zipfile'));
    });
});
