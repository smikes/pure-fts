'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
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
            record = {name: 'foo', description: 'a foo thing'};

        p.add(record);

        p.get('foo', function (err, result) {
            expect(err).to.equal(null);
            expect(result).to.deep.equal(record);
            done();
        });
    });

    it('handles missing fts', function (done) {
        var p = new Purefts();

        p.add({name: 'bar', description: 'some description'});

        p.get('bar', function (err, val) {
            expect(err).to.equal(null);
            expect(val.fts).to.equal('some description');
            done();
        });
    });

    it('handles present fts', function (done) {
        var p = new Purefts();

        p.add({name: 'bar', fts: 'some description'});

        p.get('bar', function (err, val) {
            expect(err).to.equal(null);
            expect(val.fts).to.equal('some description');
            done();
        });
    });

    it('handles missing fts & desc', function (done) {
        var p = new Purefts();

        p.add({name: 'bar'});

        p.get('bar', function (err, val) {
            expect(err).to.equal(null);
            expect(val.fts).to.equal('');
            done();
        });
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

    it('errors when obj not found', function (done) {
        var p = new Purefts();

        p.get(undefined, function (err) {
            expect(err.message).to.match(/Cannot find object with invalid/);
            done();
        });
    });

});

