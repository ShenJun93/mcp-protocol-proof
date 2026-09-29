import test from 'node:test';
import assert from 'node:assert/strict';
import {compareProtocolVersions,normalizeEndpoint,DEFAULT_MIN_PROTOCOL} from '../src/check.js';

test('default minimum matches Alexa+ hackathon floor',()=>{
  assert.equal(DEFAULT_MIN_PROTOCOL,'2025-11-25');
});

test('newer protocol versions pass lexical date comparison',()=>{
  assert.ok(compareProtocolVersions('2026-07-28','2025-11-25')>0);
  assert.equal(compareProtocolVersions('2025-11-25','2025-11-25'),0);
  assert.ok(compareProtocolVersions('2025-06-18','2025-11-25')<0);
});

test('invalid protocol version format is rejected',()=>{
  assert.throws(()=>compareProtocolVersions('modern','2025-11-25'));
});

test('endpoint normalization accepts http and https only',()=>{
  assert.equal(normalizeEndpoint('https://example.com/mcp').toString(),'https://example.com/mcp');
  assert.throws(()=>normalizeEndpoint('file:///tmp/mcp'));
});
