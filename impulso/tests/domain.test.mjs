import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterContents, recommend, safeSelection, parseSelection, toggleSelection, safeEmbed } from '../src/lib/content.mjs';

const contents = JSON.parse(readFileSync(new URL('../src/data/contents.json', import.meta.url)));
const categories = JSON.parse(readFileSync(new URL('../src/data/categories.json', import.meta.url)));

test('combined filters return only matching category and format', () => {
  const results = filterContents(contents, { category: 'disciplina', format: 'video' });
  assert(results.length > 0);
  assert(results.every((item) => item.category === 'disciplina' && item.type === 'video'));
});
test('search matches accented text and tags without requiring accents', () => {
  assert(filterContents(contents, { search: 'constancia' }).some((c) => c.id === 'constancia-e-voltar'));
  assert(filterContents(contents, { search: 'curiosidade' }).some((c) => c.id === 'katherine-johnson-curiosidade'));
  assert.equal(filterContents(contents, { search: 'not-a-real-term-123' }).length, 0);
});
test('drafts and archived content never appear in feeds or recommendations', () => {
  const hidden = [{ ...contents[0], id: 'draft', status: 'draft' }, { ...contents[0], id: 'archived', status: 'archived' }];
  assert.deepEqual(filterContents(hidden), []);
  assert.deepEqual(recommend(hidden, ['superacao'], categories), []);
});
test('selected category outranks unselected categories, including featured content', () => {
  const result = recommend(contents, ['estudos'], categories);
  const studyCount = contents.filter((c) => c.category === 'estudos').length;
  assert(result.slice(0, studyCount).every((c) => c.category === 'estudos'));
  assert.equal(result.length, contents.length);
});
test('tag affinity recommends a related category when the category is not selected', () => {
  const sample = [
    { ...contents[0], id: 'unrelated', category: 'objetivos', tags: ['planning'], featured: true },
    { ...contents[0], id: 'related', category: 'autoconfianca', tags: ['coragem'], featured: false },
  ];
  assert.equal(recommend(sample, ['superacao'], categories)[0].id, 'related');
});
test('recommendations preserve editorial tie order and never mutate input', () => {
  const before = structuredClone(contents);
  assert.deepEqual(recommend(contents, [], categories), recommend(contents, [], categories));
  recommend(contents, ['disciplina'], categories);
  assert.deepEqual(contents, before);
});
test('stored selections recover from malformed, duplicate and stale values', () => {
  assert.deepEqual(parseSelection('{oops', ['a']), []);
  assert.deepEqual(parseSelection('null', ['a']), []);
  assert.deepEqual(safeSelection(['a', 'a', 'unknown', 3, null, 'b'], ['a', 'b']), ['a', 'b']);
  assert.deepEqual(parseSelection('["removed","a"]', ['a']), ['a']);
});
test('favorites toggle without mutating the original array', () => {
  const initial = ['a'];
  assert.deepEqual(toggleSelection(initial, 'b'), ['a', 'b']);
  assert.deepEqual(toggleSelection(initial, 'a'), []);
  assert.deepEqual(initial, ['a']);
});
test('external embeds require explicit authorization and reject unexpected URLs', () => {
  assert.equal(safeEmbed({ kind: 'embed', provider: 'youtube', id: 'abcdefghijk' }), null);
  assert.equal(safeEmbed({ kind: 'embed', provider: 'youtube', id: 'https://bad.example', authorized: true }), null);
  assert.equal(safeEmbed({ kind: 'embed', provider: 'youtube', id: 'abcdefghijk', authorized: true }), 'https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0');
});
