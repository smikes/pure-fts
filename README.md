# Pure Full Text Search

Fast, compact full text search in pure javascript to support `npm-kludge-search`.

## Usage

### Building an Index

```js
var Purefts = require('pure-fts');
var p = new Purefts();

p.add({ name: 'foo', description: 'a foo thing' });
p.add({ name: 'bar', description: 'a bar thing' });

p.freeze('index');
```

### Searching an Index

```js
var Purefts = require('pure-fts');

Purefts.thaw('index', function (err, p) {

  p.get('foo', cb);      # cb(err, data) 

  p.find({ name: 'foo'}, cb, done)
                       # returns { name: 'foo', description: 'a foo thing' }

  p.search('thing', cb, done);
                       # returns [ 'foo', 'bar' ]
})

```

To support the needs of `npm-kludge-search`, this module assumes that
`name` is the unique object key.  The contents of the fields `url`,
`keywords`, `name` and `description` will be added to the full text
search index, in addition to the `name` field of the objects in the
`maintainers` array.

Any of these fields are allowed to be missing.

It would make sense to abstract this into a set of paths, if this
module were going to be useful for general purpose fts indexing.

## TODO

fts doesn't work

index on keyword or author does not work

