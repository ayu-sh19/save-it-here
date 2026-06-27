import { Hono } from 'hono';
import { searchMovies } from '../integrations/tmdb';
import { searchBooks } from '../integrations/google-books';

const discover = new Hono();

discover.get('/movies', async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ success: false, error: 'Query parameter "q" is required' }, 400);
    }

    const results = await searchMovies(query);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error('Failed to search movies:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

discover.get('/books', async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ success: false, error: 'Query parameter "q" is required' }, 400);
    }

    const results = await searchBooks(query);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error('Failed to search books:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default discover;
