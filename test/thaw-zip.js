'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
var Zip = require('adm-zip');
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('zipped pft file', function () {

    it('can be thawed', function (done) {
        Purefts.thaw('./test/fixtures/zipped.pft', function (err, q) {
            expect(err).to.equal(null);
            if (err) {
                return done(err);
            }

            q.get('foo0001', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo0001');

                done();
            });
        });
    });
});
