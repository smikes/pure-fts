'use strict';

var Purefts = require('..');
var search = require('../lib/search');
var thaw = require('../lib/thaw');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('matching objects', function () {
    it('makes a matcher', function (done) {
        var match = search.makeMatcher('foo');

        expect(match({name: 'foo'})).to.equal(true);
        expect(match({fts: 'contains food'})).to.equal(true);

        expect(match({fts: ''})).to.equal(false);

        done();
    });
});

describe('callback-friendly JSON.parse', function () {
    it("doesn't throw an exception", function (done) {
        thaw.parseJSON('invalid json', function (err) {
            expect(err).to.be.instanceof(Error);
            done();
        });
    });
});
