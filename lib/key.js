'use strict';

var buckets = 128;

function key (name) {
    var hash = 7331, i, chr, len;
    if (name.length == 0) return hash;
    for (i = 0; i < name.length; i++) {
        chr   = name.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return ((hash % buckets) + buckets) % buckets;
}

module.exports = key;

key.buckets = buckets;
