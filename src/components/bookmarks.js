export const STORAGE_KEY = 'mona-bookmarks';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function normalizeUrl(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return null;

  const withProtocol = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

export function parseBookmarks(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((bookmark) => (
      bookmark
      && typeof bookmark === 'object'
      && typeof bookmark.url === 'string'
      && typeof bookmark.slug === 'string'
      && Boolean(normalizeUrl(bookmark.url))
      && /^mona-[0-9a-zA-Z]+$/.test(bookmark.slug)
    )).map(({ url, slug }) => ({
      url: normalizeUrl(url),
      slug,
    }));
  } catch {
    return [];
  }
}

export function formatBookmark({ url, slug }) {
  return `${url} :: ${slug}`;
}

export function createSlug(seed = Date.now()) {
  let value = Math.max(0, Math.floor(seed));
  let encoded = '';

  do {
    encoded = BASE62[value % BASE62.length] + encoded;
    value = Math.floor(value / BASE62.length);
  } while (value > 0);

  return `mona-${encoded}`;
}
