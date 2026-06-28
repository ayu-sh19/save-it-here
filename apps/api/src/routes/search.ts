import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';

const search = new Hono();

search.get(
  '/global',
  async (c) => {
    const q = c.req.query('q');
    if (!q) {
      return c.json({ error: 'Query parameter q is required' }, 400);
    }

    try {
      // We use plainto_tsquery to safely parse user input into a tsquery
      const results = await prisma.$queryRaw`
        SELECT 
          id, 
          title as headline, 
          content as description, 
          'IDEA' as source, 
          ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')), plainto_tsquery('english', ${q})) as rank
        FROM "Idea"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')) @@ plainto_tsquery('english', ${q})
        
        UNION ALL
        
        SELECT 
          id, 
          merchant as headline, 
          note as description, 
          'TRANSACTION' as source, 
          ts_rank(to_tsvector('english', coalesce(merchant, '') || ' ' || coalesce(note, '')), plainto_tsquery('english', ${q})) as rank
        FROM "Transaction"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(merchant, '') || ' ' || coalesce(note, '')) @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          title as headline, 
          description as description, 
          'WISHLIST' as source, 
          ts_rank(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')), plainto_tsquery('english', ${q})) as rank
        FROM "WishlistItem"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('english', ${q})

        UNION ALL

        SELECT 
          id, 
          caption as headline, 
          "authorHandle" as description, 
          'ARCHIVE' as source, 
          ts_rank(to_tsvector('english', coalesce(caption, '') || ' ' || coalesce("authorHandle", '')), plainto_tsquery('english', ${q})) as rank
        FROM "ArchiveItem"
        WHERE "userId" = ${MOCK_USER_ID} AND to_tsvector('english', coalesce(caption, '') || ' ' || coalesce("authorHandle", '')) @@ plainto_tsquery('english', ${q})

        ORDER BY rank DESC
        LIMIT 50;
      `;

      return c.json({ data: results });
    } catch (error) {
      console.error('Global search error:', error);
      return c.json({ error: 'Failed to execute global search' }, 500);
    }
  }
);

// TMDB Genre Cache
let tmdbGenreCache: Record<number, string> | null = null;

async function getTmdbGenres() {
  if (tmdbGenreCache) return tmdbGenreCache;
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB API Key missing');
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
  const data = await res.json();
  const map: Record<number, string> = {};
  for (const g of data.genres || []) {
    map[g.id] = g.name;
  }
  tmdbGenreCache = map;
  return map;
}

search.get('/movies', async (c) => {
  const q = c.req.query('q');
  if (!q) return c.json({ data: [] });

  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return c.json({ error: 'TMDB API Key missing' }, 500);

    const [genresMap, searchRes] = await Promise.all([
      getTmdbGenres(),
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&language=en-US&page=1&include_adult=false`)
    ]);

    const data = await searchRes.json();
    const results = (data.results || []).map((m: any) => ({
      id: m.id.toString(),
      title: m.title,
      year: m.release_date ? m.release_date.split('-')[0] : '',
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
      genres: (m.genre_ids || []).map((id: number) => genresMap[id]).filter(Boolean).join(', ')
    }));

    return c.json({ data: results });
  } catch (error) {
    console.error('TMDB search error:', error);
    return c.json({ error: 'Failed to search movies' }, 500);
  }
});

search.get('/books', async (c) => {
  const q = c.req.query('q');
  if (!q) return c.json({ data: [] });

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) return c.json({ error: 'Google Books API Key missing' }, 500);

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${apiKey}&maxResults=10`);
    const data = await res.json();

    const results = (data.items || []).map((b: any) => {
      const info = b.volumeInfo || {};
      return {
        id: b.id,
        title: info.title,
        author: info.authors ? info.authors.join(', ') : '',
        coverUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        genres: info.categories ? info.categories.join(', ') : ''
      };
    });

    return c.json({ data: results });
  } catch (error) {
    console.error('Google Books search error:', error);
    return c.json({ error: 'Failed to search books' }, 500);
  }
});

export default search;
