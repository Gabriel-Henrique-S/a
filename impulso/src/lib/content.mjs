export const FORMATS = [
  { id: 'all', label: 'Tudo', singular: 'Tudo' },
  { id: 'phrase', label: 'Frases', singular: 'Frase' },
  { id: 'video', label: 'Vídeos', singular: 'Vídeo' },
  { id: 'story', label: 'Histórias', singular: 'História real' },
];

export function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function publishedContents(contents) {
  return contents.filter((content) => content.status === 'published');
}

export function filterContents(contents, { category = 'all', format = 'all', search = '' } = {}) {
  const query = normalize(search);
  return publishedContents(contents).filter((item) =>
    (category === 'all' || item.category === category) &&
    (format === 'all' || item.type === format) &&
    (!query || normalize([item.title, item.description, ...item.tags].join(' ')).includes(query))
  );
}

export function recommend(contents, interests = [], categories = []) {
  const selected = new Set(interests);
  const preferredTags = new Set(categories.filter((c) => selected.has(c.id)).flatMap((c) => c.tags));
  const score = (item) =>
    (selected.has(item.category) ? 100 : 0) +
    item.tags.filter((tag) => preferredTags.has(tag)).length * 5 +
    (item.featured ? 1 : 0);
  // Preserve editorial ordering for ties; never mutate the JSON source.
  return publishedContents(contents)
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

export function safeSelection(value, allowed) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(allowed);
  return [...new Set(value.filter((id) => typeof id === 'string' && valid.has(id)))];
}

export function parseSelection(raw, allowed) {
  try { return safeSelection(JSON.parse(raw ?? '[]'), allowed); }
  catch { return []; }
}

export function toggleSelection(items, id) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

export function safeEmbed(media) {
  if (media?.kind !== 'embed' || media.authorized !== true || media.provider !== 'youtube') return null;
  return /^[a-zA-Z0-9_-]{11}$/.test(media.id ?? '')
    ? `https://www.youtube-nocookie.com/embed/${media.id}?rel=0` : null;
}

export function mediaUrl(path) {
  if (!path) return undefined;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
