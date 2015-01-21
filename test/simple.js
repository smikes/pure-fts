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

        p.find({name: 'foo'}, function (err, result) {
            expect(err).to.equal(null);
            expect(result).to.deep.equal(record);
        }, done);
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

    it('errors when searching with a bad object', function (done) {
        var p = new Purefts();

        p.find(undefined, function (err) {
            expect(err.message).to.match(/Cannot find object/);
        }, done);
    });

    it('errors when obj not found', function (done) {
        var p = new Purefts();

        p.find({name: 'missing'}, function (err) {
            expect(err.message).to.match(/No object with name/);
        }, done);
    });

    it('errors when obj not found', function (done) {
        var p = new Purefts();

        p.get(undefined, function (err) {
            expect(err.message).to.match(/Cannot find object with invalid/);
            done();
        });
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
        p.search('foo', function (err, val) {
            expect(err).to.equal(null);
            expect(val.name).to.equal('foo');
        }, function (err) {
            expect(err).to.equal();
            done();
        });
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
        var found = 0;

        p.search('thing', function (err, val) {
            expect(err).to.equal(null);
            if (val.name === 'foo') {
                found += 1;
            } else if (val.name === 'bar') {
                found += 2;
            }
        }, function (err) {
            expect(err).to.equal();
            expect(found).to.equal(3);
            done();
        });
    });

    it('search finds zero matches', function (done) {
        p.search('quux', function () {
            throw new Error('should not be called!');
        }, function () {
            done();
        });
    });

    it('search finds single non-name matches', function (done) {
        var callCount = 0;
        p.search('thang', function (err, val) {
            expect(err).to.equal(null);
            expect(val.name).to.equal('baz');
            callCount += 1;
        }, function () {
            expect(callCount).to.equal(1);
            done();
        });
    });
});
