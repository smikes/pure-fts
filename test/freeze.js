'use strict';

var Purefts = require('..');

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
var fs = require('fs');
var rimraf = require('rimraf');
exports.lab = lab;

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('can freeze', function () {
    var item = {name: 'foo', description: 'a foo thing', fts: 'a foo thing'};

    it('can freeze an object to a file', function (done) {
        var p = new Purefts();

        p.add(item);

        p.freeze('./foo', function (err) {
            expect(err).to.equal(null);

            Purefts.thaw("./foo", function (err, q) {
                expect(err).to.equal(null);
                expect(q).to.be.instanceof(Purefts);

                q.get('foo', function (err, val) {
                    expect(err).to.equal(null);
                    expect(val).to.deep.equal(item);

                    rimraf("./foo", done);
                });
            });
        });
    });

    it('can freeze an object to a file', function (done) {
        var p = new Purefts();

        p.add(item);

        p.freeze('./foo', function (err) {
            expect(err).to.equal(null);

            Purefts.thaw("./foo", function (err, q) {
                expect(err).to.equal(null);
                expect(q).to.be.instanceof(Purefts);

                q.get('bar', function (err, val) {
                    expect(err).to.be.instanceof(Error);
                    expect(val).to.equal();

                    rimraf("./foo", done);
                });
            });
        });
    });
});

describe('a large test, >1024 objects', function () {
    var item = {name: 'foo', description: 'a foo thing', fts: 'a foo thing'};

    function zeroPad(i) {
        var v = i.toString(10);
        while (v.length < 4) {
            v = '0' + v;
        }
        return v;
    }

    lab.before(function (done) {
        var p = new Purefts(),
            i,
            obj;

        for (i = 0; i < 5000; i += 1) {
            obj = JSON.parse(JSON.stringify(item));
            obj.name = 'foo' + zeroPad(i);
            p.add(obj);
        }

        p.freeze('./foo', function (err) {
            expect(err).to.equal(null);
            done();
        });
    });

    lab.after(function (done) {
        rimraf('./foo', done);
    });

    it('can find first object in first bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo0001', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo0001');

                done();
            });
        });
    });

    it('can find an object twice', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo0001', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo0001');

                q.get('foo0410', function (err, val) {
                    expect(err).to.equal(null);
                    expect(val.name).to.equal('foo0410');

                    done();
                });
            });
        });
    });

    it('errors on missing object', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo0001.0', function (err, val) {
                expect(err.message).to.match(/No object with name/);
                expect(val).to.equal();

                done();
            });
        });
    });

    it('can find last object in first bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo1023', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo1023');

                done();
            });
        });
    });

    it('can find first object in second bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo1024', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo1024');

                done();
            });
        });
    });

    it('can find first object in second bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo2047', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo2047');

                done();
            });
        });
    });

    it('can find first object in last bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo2048', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo2048');

                done();
            });
        });
    });

    it('can search for term', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.search('foo0001', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo0001');
            }, done);
        });
    });

    it('can search for term', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.search('fooblub', function () {
                expect(1).to.equal(0);
            }, done);
        });
    });


    it('can find last object in last bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo2499', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo2499');

                done();
            });
        });
    });
});


describe('an exact multiple test, 1024 objects', function () {
    var item = {name: 'foo', description: 'a foo thing', fts: 'a foo thing'};

    function zeroPad(i) {
        var v = i.toString(10);
        while (v.length < 4) {
            v = '0' + v;
        }
        return v;
    }

    lab.before(function (done) {
        var p = new Purefts(),
            i,
            obj;

        for (i = 0; i < 1024; i += 1) {
            obj = JSON.parse(JSON.stringify(item));
            obj.name = 'foo' + zeroPad(i);
            p.add(obj);
        }

        p.freeze('./foo', function (err) {
            expect(err).to.equal(null);
            done();
        });
    });

    lab.after(function (done) {
        rimraf('./foo', done);
    });

    it('can find first object in only bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo0001', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo0001');

                done();
            });
        });
    });

    it('can find last object in only bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.get('foo1023', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo1023');

                done();
            });
        });
    });

    it('can search bag', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            q.search('foo1023', function (err, val) {
                expect(err).to.equal(null);
                expect(val.name).to.equal('foo1023');

            }, done);
        });
    });

    it('can search for bad term', function (done) {

        Purefts.thaw("./foo", function (err, q) {
            expect(err).to.equal(null);
            expect(q).to.be.instanceof(Purefts);

            done();
        });
    });
});
