'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
exports.lab = lab;

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
        /* deliberately testing evilness */
        /*jslint newcap:true*/
        var p = Purefts();

        expect(p).to.be.instanceof(Purefts);
        done();
    });
});

describe('can add and find objects', function () {
    it('stores an object once added', function (done) {
        var p = new Purefts(),
            record = {name: 'foo', description: 'a foo thing'},
            result;

        p.add(record);

        result = p.find({name: 'foo'});

        expect(result).to.deep.equal(record);

        done();
    });

    it('throws when adding a bad object', function (done) {
        var p = new Purefts();

        expect(function () {
            p.add();
        }).to.throw(Error, /Cannot add object/);

        expect(function () {
            p.add({});
        }).to.throw(Error, /Cannot add object/);

        done();
    });

    it('throws when searching with a bad object', function (done) {
        var p = new Purefts();

        expect(function () {
            p.find();
        }).to.throw(Error, /Cannot find object/);

        expect(function () {
            p.find({});
        }).to.throw(Error, /Cannot find object/);

        done();
    });
});

describe('can add and search objects', function () {
    var p;
    lab.beforeEach(function (done) {
        p = new Purefts();
        p.add({name: 'foo', description: 'a foo thing'});
        p.add({name: 'bar', description: 'a bar thing'});
        p.add({name: 'baz', description: 'a baz thang'});

        done();
    });

    it('search finds exact match', function (done) {
        expect(p.search('foo')).to.deep.equal(['foo']);

        done();
    });

    it('is sorted after clean', function (done) {
        p.clean();

        expect(p.keys).to.deep.equal(['bar', 'baz', 'foo']);

        done();
    });

    it('only cleans when needed', function (done) {
        p.clean();
        var k = p.keys;

        p.clean();

        expect(p.keys).to.equal(k);

        done();
    });

    it('search finds multiple matches', function (done) {
        expect(p.search('thing')).to.deep.equal(['bar', 'foo']);

        done();
    });

    it('search finds zero matches', function (done) {
        expect(p.search('quux')).to.deep.equal([]);

        done();
    });

    it('search finds single non-name matches', function (done) {
        expect(p.search('thang')).to.deep.equal(['baz']);

        done();
    });
});
