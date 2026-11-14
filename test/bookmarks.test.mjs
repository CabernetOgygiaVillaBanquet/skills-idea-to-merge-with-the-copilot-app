import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBookmark, normalizeUrl, parseBookmarks } from '../src/components/bookmarks.js';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('example.com'), normalizeUrl('https://example.com'));
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of ['', 'not json', '{"url":"https://example.com"}', '{"bookmarks":[]}', 'null', '42']) {
    assert.deepEqual(parseBookmarks(value), []);
  }
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
