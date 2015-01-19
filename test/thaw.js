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
            done();
        });
    });

    it('errors on nonexistent file', function (done) {
        Purefts.thaw('./test/fixtures/non-existent', function (err) {
            expect(err).to.be.instanceof(Error);
            done();
        });
    });

    it('errors on invalid format', function (done) {
        Purefts.thaw('./test/fixtures/invalid2', function (err) {
            expect(err).to.be.instanceof(Error);
            done();
        });
    });
});


