'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
var fs = require('fs');
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('thaw errors', function () {
    it('errors on invalid version', function (done) {
        var thawer = Purefts.thaw.chooseThawer('bad');

        thawer(null, function (err) {
            expect(err).to.be.instanceof(Error);
            expect(err.message).to.match(/unknown version "bad"/);
            done();
        });
    });

    it('errors on nonexistent file', function (done) {
        Purefts.thaw('./test/fixtures/non-existent', function (err) {
            expect(err).to.match(/Invalid filename/);
            done();
        });
    });

    it('errors on invalid format', function (done) {
        Purefts.thaw('./test/fixtures/invalid', function (err) {
            expect(err).to.match(/unsupported zip/);
            done();
        });
    });
});

/*
describe('valid thaw - old version', function () {
    it('can thaw v1.0.0', function (done) {
        Purefts.thaw('test/fixtures/v1-0-0-test', function (err, p) {
            var expected = {"name": "foo", "description": "a foo thing"};

            expect(err).to.equal(null);

            expect(p.search('foo')).to.deep.equal(['foo']);

            expect(p.find({name: 'foo'})).to.deep.equal(expected);

            done();
        });
    });
});

*/
