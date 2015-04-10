'use strict';

var path = require('path');
var bufferEqual = require('buffer-equal');
var isPng = require('is-png');
var read = require('vinyl-file').read;
var test = require('ava');
var imageminPngcrush = require('../');

test('optimize a PNG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.assert(!err, err);

		var stream = imageminPngcrush()();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size, data.contents.length);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('skip optimizing non-PNG file', function (t) {
	t.plan(2);

	read(__filename, function (err, file) {
		t.assert(!err, err);

		var stream = imageminPngcrush()();
		var buf = file.contents.slice();

		stream.on('data', function (data) {
			t.assert(bufferEqual(file.contents, buf));
		});

		stream.end(file);
	});
});
