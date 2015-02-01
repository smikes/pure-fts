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

    it('can find small range', function (done) {
        Purefts.thaw('./test/fixtures/zipped.pft', function (err, q) {
            expect(err).to.equal(null);
            var results = [];

            q.findRange('foo0001', 'foo0002', function (err, val) {
                expect(err).to.equal(null);
                results.push(val);
            }, function () {
                expect(results).to.deep.equal(['foo0001', 'foo0002']);
                done();
            });
        });
    });

});
