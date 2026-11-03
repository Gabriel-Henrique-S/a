import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeEmbed } from '../src/lib/content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contents = JSON.parse(readFileSync(resolve(root, 'src/data/contents.json'), 'utf8'));
const categories = JSON.parse(readFileSync(resolve(root, 'src/data/categories.json'), 'utf8'));
const ids = new Set();
const categoryIds = new Set(categories.map((c) => c.id));
const checkAsset = (file) => {
  assert.equal(typeof file, 'string');
  assert(!file.includes('..') && !file.startsWith('/') && !file.includes(':'), `Unsafe asset: ${file}`);
  assert(existsSync(resolve(root, 'public', file)), `Missing media: ${file}`);
};
for (const content of contents) {
  for (const field of ['id', 'type', 'title', 'description', 'category', 'tags', 'author', 'source', 'media', 'status']) {
    assert(Object.hasOwn(content, field), `Missing ${field} on ${content.id}`);
  }
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.id));
  assert(!ids.has(content.id), `Duplicate content: ${content.id}`);
  ids.add(content.id);
  assert(['phrase', 'video', 'story'].includes(content.type));
  assert(['draft', 'published', 'archived'].includes(content.status));
  assert(categoryIds.has(content.category));
  assert(Array.isArray(content.tags) && content.tags.every((t) => typeof t === 'string'));
  if (content.status !== 'published') continue;
  assert(content.title && content.description && content.author);
  assert(Array.isArray(content.body) && content.body.length && content.body.every((p) => typeof p === 'string'));
  assert(content.prompt);
  assert(['original', 'external'].includes(content.source.kind));
  assert(content.source.label);
  if (content.source.kind === 'external') assert(new URL(content.source.url).protocol === 'https:');
  if (content.type === 'story') assert.equal(content.source.kind, 'external', 'Real stories need a verifiable source');
  if (content.type === 'video') {
    assert(content.media);
    assert(/^\d+:\d{2}$/.test(content.media.duration), 'Video duration must use m:ss');
    checkAsset(content.media.poster);
    if (content.media.kind === 'video') {
      checkAsset(content.media.src);
      checkAsset(content.media.captions);
    } else assert(safeEmbed(content.media), 'External video embeds need explicit authorization and a supported ID');
  }
}
console.log(`Catálogo validado: ${contents.length} conteúdos, ${categories.length} categorias e todas as mídias locais presentes.`);
